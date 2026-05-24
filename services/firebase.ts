import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  Auth,
  getReactNativePersistence,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  getDocs,
  query,
} from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course } from '../utils/types';
import { SAMPLE_COURSES } from '../utils/constants';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  ...(process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
    ? { measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID }
    : {}),
};

const appIdValid =
  typeof firebaseConfig.appId === 'string' &&
  firebaseConfig.appId.trim().startsWith('1:');

const hasConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    appIdValid
);

if (firebaseConfig.appId && !appIdValid) {
  console.error(
    '[Firebase] Invalid EXPO_PUBLIC_FIREBASE_APP_ID. It should look like: 1:466237020760:web:xxxxxxxx'
  );
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let initError: string | null = null;

const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
};

const initFirebaseAuth = (): Auth => {
  const firebaseApp = getFirebaseApp();

  if (Platform.OS === 'web') {
    return getAuth(firebaseApp);
  }

  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === 'auth/already-initialized') {
      return getAuth(firebaseApp);
    }
    throw error;
  }
};

/** Lazy-init Firebase (fixes RN "auth not registered" + hot reload issues) */
export const ensureFirebaseInitialized = (): boolean => {
  if (!hasConfig) {
    return false;
  }

  if (initError) {
    return false;
  }

  try {
    if (!auth) {
      auth = initFirebaseAuth();
    }
    if (!db) {
      db = getFirestore(getFirebaseApp());
    }
    console.log(
      `[Firebase] Connected to project: ${firebaseConfig.projectId}`
    );
    return true;
  } catch (error) {
    initError = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Firebase] Initialization failed:', initError);
    auth = null;
    db = null;
    return false;
  }
};

export const getFirebaseAuth = (): Auth | null => {
  if (!hasConfig) return null;
  if (!auth && !initError) {
    ensureFirebaseInitialized();
  }
  return auth;
};

export const getFirebaseDb = (): Firestore | null => {
  if (!hasConfig) return null;
  if (!db && !initError) {
    ensureFirebaseInitialized();
  }
  return db;
};

export const getFirebaseProjectId = (): string | undefined =>
  firebaseConfig.projectId;
export const getFirebaseInitError = (): string | null => initError;
export const isFirebaseConfigured = (): boolean => {
  if (!hasConfig || initError) return false;
  return Boolean(getFirebaseAuth() && getFirebaseDb());
};

export const loadCoursesFromFirebase = async (): Promise<Course[]> => {
  try {
    if (!ensureFirebaseInitialized() || !db) {
      return SAMPLE_COURSES;
    }

    const coursesCollection = collection(db, 'courses');
    const querySnapshot = await getDocs(query(coursesCollection));

    const courses: Course[] = [];
    querySnapshot.forEach((docSnap) => {
      courses.push({
        id: docSnap.id,
        ...docSnap.data(),
      } as Course);
    });

    return courses.length > 0 ? courses : SAMPLE_COURSES;
  } catch (error) {
    console.error('[Firebase] Error loading courses:', error);
    return SAMPLE_COURSES;
  }
};

export const initializeFirebase = () => {
  ensureFirebaseInitialized();
  return db;
};
