import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from './firebase';
import { StudentProgress, Course } from '../utils/types';
import { SAMPLE_PROGRESS_DATA } from '../utils/constants';
import { useCourseStore } from '../stores/courseStore';

const PROGRESS_SEP = '__';

/** Top-level collection — simpler Firestore rules than nested subcollections */
const progressDocId = (userId: string, courseId: string) =>
  `${userId}${PROGRESS_SEP}${courseId}`;

const progressDoc = (userId: string, courseId: string) =>
  doc(getFirebaseDb()!, 'courseProgress', progressDocId(userId, courseId));

/** Wait until Firebase Auth token is ready for Firestore rules */
const ensureAuthReady = async (userId: string): Promise<boolean> => {
  const auth = getFirebaseAuth();
  if (!auth?.currentUser || auth.currentUser.uid !== userId) {
    return false;
  }
  try {
    await auth.currentUser.getIdToken();
    return true;
  } catch {
    return false;
  }
};

const toDate = (value: unknown): Date => {
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === 'string') return new Date(value);
  return new Date();
};

const serializeProgress = (
  userId: string,
  courseId: string,
  progress: StudentProgress
) => ({
  userId,
  courseId,
  currentYearLevel: progress.currentYearLevel,
  currentSemester: progress.currentSemester,
  completedSubjects: progress.completedSubjects,
  ongoingSubjects: progress.ongoingSubjects,
  remainingSubjects: progress.remainingSubjects,
  progressPercentage: progress.progressPercentage,
  graduationReady: progress.graduationReady,
  enrollmentDate: progress.enrollmentDate,
  expectedGraduationDate: progress.expectedGraduationDate,
  lastAssessmentAt: progress.lastAssessmentAt || null,
  updatedAt: serverTimestamp(),
});

const deserializeProgress = (
  courseId: string,
  data: Record<string, unknown>
): StudentProgress => ({
  courseId,
  currentYearLevel: data.currentYearLevel as StudentProgress['currentYearLevel'],
  currentSemester: data.currentSemester as StudentProgress['currentSemester'],
  completedSubjects: (data.completedSubjects as string[]) || [],
  ongoingSubjects: (data.ongoingSubjects as string[]) || [],
  remainingSubjects: (data.remainingSubjects as string[]) || [],
  progressPercentage: Number(data.progressPercentage) || 0,
  graduationReady: Boolean(data.graduationReady),
  enrollmentDate: toDate(data.enrollmentDate),
  expectedGraduationDate: toDate(data.expectedGraduationDate),
  lastAssessmentAt: data.lastAssessmentAt
    ? toDate(data.lastAssessmentAt)
    : undefined,
});

/** Default template from constants (demo baseline per program) */
export const getTemplateProgress = (courseId: string): StudentProgress | null => {
  const template =
    SAMPLE_PROGRESS_DATA[courseId as keyof typeof SAMPLE_PROGRESS_DATA];
  if (!template) return null;

  return {
    ...template,
    courseId,
    completedSubjects: [...template.completedSubjects],
    ongoingSubjects: [...template.ongoingSubjects],
    remainingSubjects: [...template.remainingSubjects],
    enrollmentDate: new Date(template.enrollmentDate),
    expectedGraduationDate: new Date(template.expectedGraduationDate),
  };
};

/** Brand-new enrollment built from course curriculum */
export const createFreshProgress = (course: Course): StudentProgress => {
  const curriculum = course.curriculum || [];
  const ongoing = curriculum.slice(0, Math.min(2, curriculum.length));
  const remaining = curriculum.slice(ongoing.length);
  const now = new Date();
  const graduation = new Date(now);
  graduation.setFullYear(graduation.getFullYear() + 4);

  return {
    courseId: course.id,
    currentYearLevel: 1,
    currentSemester: 1,
    completedSubjects: [],
    ongoingSubjects: ongoing,
    remainingSubjects: remaining,
    progressPercentage: 0,
    graduationReady: false,
    enrollmentDate: now,
    expectedGraduationDate: graduation,
  };
};

export const saveCourseProgress = async (
  userId: string,
  courseId: string,
  progress: StudentProgress
): Promise<StudentProgress> => {
  const payload = { ...progress, courseId };

  if (!isFirebaseConfigured() || !(await ensureAuthReady(userId))) {
    return payload;
  }

  const db = getFirebaseDb()!;
  await setDoc(
    progressDoc(userId, courseId),
    serializeProgress(userId, courseId, payload),
    { merge: true }
  );

  return payload;
};

export const loadCourseProgress = async (
  userId: string,
  courseId: string
): Promise<StudentProgress | null> => {
  if (!isFirebaseConfigured()) {
    return getTemplateProgress(courseId);
  }

  if (!(await ensureAuthReady(userId))) {
    return null;
  }

  try {
    const snap = await getDoc(progressDoc(userId, courseId));
    if (!snap.exists()) {
      return null;
    }
    return deserializeProgress(courseId, snap.data() as Record<string, unknown>);
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === 'permission-denied') {
      console.warn(
        '[progressService] Permission denied. Publish firestore.rules (courseProgress collection).'
      );
      return null;
    }
    console.error('[progressService] loadCourseProgress:', error);
    return null;
  }
};

export const loadAllCourseProgress = async (
  userId: string
): Promise<Record<string, StudentProgress>> => {
  if (!isFirebaseConfigured()) {
    return {};
  }

  if (!(await ensureAuthReady(userId))) {
    return {};
  }

  try {
    const db = getFirebaseDb()!;
    const snap = await getDocs(
      query(collection(db, 'courseProgress'), where('userId', '==', userId))
    );
    const map: Record<string, StudentProgress> = {};
    snap.forEach((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      const courseId = (data.courseId as string) || docSnap.id.split(PROGRESS_SEP)[1];
      map[courseId] = deserializeProgress(courseId, data);
    });
    return map;
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === 'permission-denied') {
      console.warn(
        '[progressService] Permission denied loading progress. Publish firestore.rules in Firebase Console (project wisepath-v2).'
      );
    } else {
      console.error('[progressService] loadAllCourseProgress:', error);
    }
    return {};
  }
};

/**
 * After assessment: ensure progress exists for recommended course and apply milestone update.
 */
export const applyAssessmentToProgress = async (
  userId: string,
  courseId: string
): Promise<StudentProgress> => {
  const courses = useCourseStore.getState().allCourses;
  const course =
    courses.find((c) => c.id === courseId) ||
    ({ id: courseId, curriculum: [] } as Course);

  let progress = await loadCourseProgress(userId, courseId);

  if (!progress) {
    progress = getTemplateProgress(courseId) ?? createFreshProgress(course);
    progress.enrollmentDate = new Date();
    const grad = new Date();
    grad.setFullYear(grad.getFullYear() + 4);
    progress.expectedGraduationDate = grad;
    progress.progressPercentage = 10;
  } else {
    progress = {
      ...progress,
      progressPercentage: Math.min(100, progress.progressPercentage + 10),
    };
  }

  progress.lastAssessmentAt = new Date();
  progress.graduationReady =
    progress.progressPercentage >= 100 &&
    progress.remainingSubjects.length === 0;

  return saveCourseProgress(userId, courseId, progress);
};

/**
 * Start course / enroll: persist full program progress (template if new).
 */
export const enrollInCourse = async (
  userId: string,
  courseId: string
): Promise<StudentProgress> => {
  const courses = useCourseStore.getState().allCourses;
  const course = courses.find((c) => c.id === courseId);

  let progress = await loadCourseProgress(userId, courseId);

  if (!progress && course) {
    progress = getTemplateProgress(courseId) ?? createFreshProgress(course);
  } else if (!progress) {
    progress = getTemplateProgress(courseId);
  }

  if (!progress) {
    throw new Error('Could not load progress for this course.');
  }

  if (!progress.enrollmentDate || progress.progressPercentage === 0) {
    progress.enrollmentDate = progress.enrollmentDate || new Date();
    progress.progressPercentage = Math.max(progress.progressPercentage, 15);
  }

  return saveCourseProgress(userId, courseId, progress);
};

/** Remove saved progress for one program (e.g. after assessment deleted). */
export const deleteCourseProgressRecord = async (
  userId: string,
  courseId: string
): Promise<void> => {
  if (!isFirebaseConfigured() || !(await ensureAuthReady(userId))) return;

  try {
    await deleteDoc(progressDoc(userId, courseId));
  } catch (error) {
    console.error('[progressService] deleteCourseProgressRecord:', error);
  }
};

/** Clear all program progress for a student (e.g. all assessments removed). */
export const clearAllUserCourseProgress = async (userId: string): Promise<void> => {
  if (!isFirebaseConfigured() || !(await ensureAuthReady(userId))) return;

  try {
    const db = getFirebaseDb()!;
    const snap = await getDocs(
      query(collection(db, 'courseProgress'), where('userId', '==', userId))
    );
    await Promise.all(snap.docs.map((docSnap) => deleteDoc(docSnap.ref)));
  } catch (error) {
    console.error('[progressService] clearAllUserCourseProgress:', error);
  }
};
