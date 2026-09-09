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
import {
  getFirebaseDb,
  isFirebaseConfigured,
  sanitizeForFirestore,
} from './firebase';
import { CourseRanking, QuizResult, Recommendation } from '../utils/types';

const toDate = (value: unknown): Date => {
  if (value instanceof Date) return value;
  if (value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }
  return new Date();
};

const mapAssessmentDoc = (
  id: string,
  data: Record<string, unknown>
): QuizResult => ({
  id,
  userId: data.userId as string | undefined,
  quizAnswers: (data.quizAnswers as Record<string, string>) || {},
  strengths: (data.strengths as string[]) || [],
  recommendedPaths: (data.recommendedPaths as Recommendation[]) || [],
  courseRankings: (data.courseRankings as CourseRanking[]) || [],
  bestCourseId: data.bestCourseId as string | undefined,
  completedAt: toDate(data.completedAt),
});

export const saveAssessmentResult = async (
  userId: string,
  result: Omit<QuizResult, 'id' | 'userId'>
): Promise<string | undefined> => {
  if (!isFirebaseConfigured()) return undefined;

  const db = getFirebaseDb()!;
  const assessment = sanitizeForFirestore({
    userId,
    quizAnswers: result.quizAnswers,
    strengths: result.strengths,
    recommendedPaths: result.recommendedPaths,
    courseRankings: result.courseRankings,
    bestCourseId: result.bestCourseId,
    completedAt: result.completedAt,
  });
  const ref = await addDoc(collection(db, 'assessments'), {
    ...assessment,
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
    try {
      const indexed = query(
        collection(db, 'assessments'),
        where('userId', '==', userId),
        orderBy('completedAt', 'desc')
      );
      const snap = await getDocs(indexed);
      return snap.docs.map((docSnap) =>
        mapAssessmentDoc(docSnap.id, docSnap.data())
      );
    } catch (indexError) {
      console.warn(
        '[userDataService] assessments index missing, using unordered query:',
        indexError
      );
      const fallback = query(
        collection(db, 'assessments'),
        where('userId', '==', userId)
      );
      const snap = await getDocs(fallback);
      return snap.docs
        .map((docSnap) => mapAssessmentDoc(docSnap.id, docSnap.data()))
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
    }
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

    return snap.docs.map((docSnap) =>
      mapAssessmentDoc(docSnap.id, docSnap.data())
    );
  } catch (error) {
    console.error('[userDataService] loadAllAssessments:', error);
    return [];
  }
};
