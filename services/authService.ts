import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from './firebase';
import { UserAccount, UserProfile, UserRole } from '../utils/types';
import { ADMIN_REGISTRATION_CODE } from '../utils/constants';

const USERS_COLLECTION = 'users';

/** User-friendly messages for Firebase Auth error codes */
export const getFirebaseAuthErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code ?? '';
  const message = error instanceof Error ? error.message : String(error);

  switch (code) {
    case 'auth/configuration-not-found':
      return (
        'Firebase Authentication is not enabled for this project. ' +
        'In Firebase Console → Authentication → Sign-in method, enable Email/Password, then try again.'
      );
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    default:
      if (message.includes('CONFIGURATION_NOT_FOUND')) {
        return (
          'Firebase Authentication is not enabled. Open Authentication in the Firebase Console, click Get Started, and enable Email/Password.'
        );
      }
      return message || 'Authentication failed. Please try again.';
  }
};

export const registerWithEmail = async (
  email: string,
  password: string,
  role: UserRole = 'student',
  adminCode?: string
): Promise<UserAccount> => {
  if (!isFirebaseConfigured()) {
    return mockRegister(email, role);
  }

  if (role === 'admin' && adminCode !== ADMIN_REGISTRATION_CODE) {
    throw new Error('Invalid administrator registration code.');
  }

  const auth = getFirebaseAuth()!;
  const db = getFirebaseDb()!;
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  const account: UserAccount = {
    uid: credential.user.uid,
    email: credential.user.email || email,
    role,
    profileComplete: role === 'admin',
    createdAt: new Date(),
  };

  await setDoc(
    doc(db, USERS_COLLECTION, credential.user.uid),
    {
      email: account.email,
      role: account.role,
      profileComplete: account.profileComplete,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  return account;
};

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User; account: UserAccount }> => {
  if (!isFirebaseConfigured()) {
    const account = mockLogin(email);
    return { user: { uid: account.uid, email: account.email } as User, account };
  }

  const auth = getFirebaseAuth()!;
  const credential = await signInWithEmailAndPassword(auth, email, password);
  let account = await fetchUserAccount(credential.user.uid);

  // Recover accounts created in Auth but missing a Firestore user doc
  if (!account) {
    account = {
      uid: credential.user.uid,
      email: credential.user.email || email,
      role: 'student',
      profileComplete: false,
      createdAt: new Date(),
    };
    await setDoc(doc(db, USERS_COLLECTION, credential.user.uid), {
      ...account,
      createdAt: serverTimestamp(),
    });
  }

  return { user: credential.user, account };
};

export const logoutUser = async (): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  const auth = getFirebaseAuth();
  if (auth?.currentUser) {
    await signOut(auth);
  }
};

export const fetchUserAccount = async (uid: string): Promise<UserAccount | null> => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb()!;
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    uid: snap.id,
    email: data.email,
    role: data.role || 'student',
    profileComplete: Boolean(data.profileComplete),
    profile: data.profile,
    createdAt: data.createdAt?.toDate?.() || undefined,
  };
};

export const saveUserProfile = async (
  uid: string,
  profile: UserProfile
): Promise<void> => {
  if (!isFirebaseConfigured()) return;

  const db = getFirebaseDb()!;
  await setDoc(
    doc(db, USERS_COLLECTION, uid),
    {
      profile,
      profileComplete: true,
      activeCourseId: profile.selectedPath?.courses[0]?.id || null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

/** Offline/demo auth when Firebase env is not configured */
const mockRegister = (email: string, role: UserRole): UserAccount => ({
  uid: `mock-${Date.now()}`,
  email,
  role,
  profileComplete: role === 'admin',
  createdAt: new Date(),
});

const mockLogin = (email: string): UserAccount => {
  const isAdmin = email.toLowerCase().includes('admin');
  return {
    uid: `mock-${email}`,
    email,
    role: isAdmin ? 'admin' : 'student',
    profileComplete: isAdmin,
    createdAt: new Date(),
  };
};
