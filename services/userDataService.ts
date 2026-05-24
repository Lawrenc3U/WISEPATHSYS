import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from './firebase';
import { QuizResult, Recommendation } from '../utils/types';

export const saveAssessmentResult = async (
  userId: string,
  result: Omit<QuizResult, 'id' | 'userId'>
): Promise<string | undefined> => {
  if (!isFirebaseConfigured()) return undefined;

  const db = getFirebaseDb()!;
  const ref = await addDoc(collection(db, 'assessments'), {
    userId,
    quizAnswers: result.quizAnswers,
    strengths: result.strengths,
    recommendedPaths: result.recommendedPaths,
    courseRankings: result.courseRankings ?? null,
    bestCourseId: result.bestCourseId,
    completedAt: result.completedAt,
    savedAt: serverTimestamp(),
  });
  return ref.id;
};

export const deleteAssessmentResult = async (
  assessmentId: string,
  userId: string
): Promise<void> => {
  if (!isFirebaseConfigured()) return;

  const db = getFirebaseDb()!;
  await deleteDoc(doc(db, 'assessments', assessmentId));
  console.log('[userDataService] Deleted assessment', assessmentId, 'for', userId);
};

export const deleteAllUserAssessments = async (userId: string): Promise<void> => {
  if (!isFirebaseConfigured()) return;

  const records = await loadUserAssessments(userId);
  await Promise.all(
    records
      .filter((r) => r.id)
      .map((r) => deleteAssessmentResult(r.id!, userId))
  );
};

export const loadUserAssessments = async (
  userId: string
): Promise<QuizResult[]> => {
  if (!isFirebaseConfigured()) return [];

  try {
    const db = getFirebaseDb()!;
    const q = query(
      collection(db, 'assessments'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        quizAnswers: data.quizAnswers,
        strengths: data.strengths,
        recommendedPaths: data.recommendedPaths,
        bestCourseId: data.bestCourseId,
        completedAt: data.completedAt?.toDate?.() || new Date(),
      } as QuizResult;
    });
  } catch (error) {
    console.error('[userDataService] loadUserAssessments:', error);
    return [];
  }
};

export const loadAllAssessments = async (): Promise<QuizResult[]> => {
  if (!isFirebaseConfigured()) return [];

  try {
    const db = getFirebaseDb()!;
    const snap = await getDocs(collection(db, 'assessments'));

    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        quizAnswers: data.quizAnswers,
        strengths: data.strengths,
        recommendedPaths: data.recommendedPaths as Recommendation[],
        bestCourseId: data.bestCourseId,
        completedAt: data.completedAt?.toDate?.() || new Date(),
      };
    });
  } catch (error) {
    console.error('[userDataService] loadAllAssessments:', error);
    return [];
  }
};
