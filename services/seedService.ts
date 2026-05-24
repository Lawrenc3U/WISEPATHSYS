import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { getFirebaseDb, getFirebaseAuth, isFirebaseConfigured } from './firebase';
import { fetchUserAccount } from './authService';
import { QUIZ_QUESTIONS, SAMPLE_COURSES } from '../utils/constants';

/**
 * Seeds Firestore with default courses and quiz questions when collections are empty.
 * Must be called while signed in as admin (Firestore security rules).
 */
export const seedFirestoreIfEmpty = async (): Promise<{
  seededCourses: boolean;
  seededQuestions: boolean;
  error?: string;
}> => {
  const result = { seededCourses: false, seededQuestions: false };

  if (!isFirebaseConfigured()) {
    return { ...result, error: 'Firebase not configured' };
  }

  const auth = getFirebaseAuth();
  const uid = auth?.currentUser?.uid;
  if (!uid) {
    return { ...result, error: 'Sign in as admin to seed the database' };
  }

  const account = await fetchUserAccount(uid);
  if (account?.role !== 'admin') {
    return { ...result, error: 'Admin access required to seed database' };
  }

  const db = getFirebaseDb()!;

  try {
    const coursesSnap = await getDocs(collection(db, 'courses'));
    if (coursesSnap.empty) {
      await Promise.all(
        SAMPLE_COURSES.map((course) =>
          setDoc(doc(db, 'courses', course.id), course)
        )
      );
      result.seededCourses = true;
      console.log('[Firebase] Seeded courses collection');
    }

    const questionsSnap = await getDocs(collection(db, 'quizQuestions'));
    if (questionsSnap.empty) {
      await Promise.all(
        QUIZ_QUESTIONS.map((question) =>
          setDoc(doc(db, 'quizQuestions', question.id), question)
        )
      );
      result.seededQuestions = true;
      console.log('[Firebase] Seeded quizQuestions collection');
    }
  } catch (error) {
    console.error('[Firebase] Seed failed (check Firestore rules):', error);
  }

  return result;
};
