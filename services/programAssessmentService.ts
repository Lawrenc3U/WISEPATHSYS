import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from './firebase';
import {
  ProgramAssessment,
  ProgramAssessmentCompletion,
  StudentProgress,
} from '../utils/types';
import {
  getProgramAssessmentsForCourse,
  PROGRAM_ASSESSMENTS,
} from '../utils/constants';
import {
  loadCourseProgress,
  saveCourseProgress,
  getTemplateProgress,
  createFreshProgress,
} from './progressService';
import { useCourseStore } from '../stores/courseStore';
import { Course } from '../utils/types';

const COMPLETION_SEP = '__';

const completionDocId = (
  userId: string,
  courseId: string,
  assessmentId: string
) => `${userId}${COMPLETION_SEP}${courseId}${COMPLETION_SEP}${assessmentId}`;

const completionDoc = (userId: string, courseId: string, assessmentId: string) =>
  doc(
    getFirebaseDb()!,
    'programAssessmentCompletions',
    completionDocId(userId, courseId, assessmentId)
  );

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

export const getAllProgramAssessments = (): ProgramAssessment[] =>
  PROGRAM_ASSESSMENTS;

export const getAssessmentsForCourse = (courseId: string): ProgramAssessment[] =>
  getProgramAssessmentsForCourse(courseId);

export const isAssessmentComplete = (
  completions: ProgramAssessmentCompletion[],
  courseId: string,
  assessmentId: string
): boolean =>
  completions.some(
    (c) => c.courseId === courseId && c.assessmentId === assessmentId
  );

/** Progress bump per completed program assessment (even split up to 60% of bar) */
export const progressIncrementPerAssessment = (courseId: string): number => {
  const total = getAssessmentsForCourse(courseId).length || 1;
  return Math.floor(60 / total);
};

export const loadUserProgramAssessmentCompletions = async (
  userId: string
): Promise<ProgramAssessmentCompletion[]> => {
  if (!isFirebaseConfigured() || !(await ensureAuthReady(userId))) {
    return [];
  }

  try {
    const db = getFirebaseDb()!;
    const snap = await getDocs(
      query(
        collection(db, 'programAssessmentCompletions'),
        where('userId', '==', userId)
      )
    );
    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        userId: data.userId as string,
        courseId: data.courseId as string,
        assessmentId: data.assessmentId as string,
        completedAt: toDate(data.completedAt),
      };
    });
  } catch (error) {
    console.error('[programAssessmentService] load completions:', error);
    return [];
  }
};

export const completeProgramAssessment = async (
  userId: string,
  courseId: string,
  assessmentId: string
): Promise<{
  completion: ProgramAssessmentCompletion;
  progress: StudentProgress;
}> => {
  const completion: ProgramAssessmentCompletion = {
    userId,
    courseId,
    assessmentId,
    completedAt: new Date(),
  };

  if (isFirebaseConfigured() && (await ensureAuthReady(userId))) {
    await setDoc(completionDoc(userId, courseId, assessmentId), {
      userId,
      courseId,
      assessmentId,
      completedAt: serverTimestamp(),
    });
  }

  const progress = await syncProgressFromProgramAssessments(userId, courseId);
  return { completion, progress };
};

/** Recalculate program progress from how many assessments are done */
export const syncProgressFromProgramAssessments = async (
  userId: string,
  courseId: string,
  existingCompletions?: ProgramAssessmentCompletion[]
): Promise<StudentProgress> => {
  const assessments = getAssessmentsForCourse(courseId);
  const completions =
    existingCompletions ??
    (await loadUserProgramAssessmentCompletions(userId)).filter(
      (c) => c.courseId === courseId
    );

  const doneCount = assessments.filter((a) =>
    completions.some((c) => c.assessmentId === a.id)
  ).length;

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
  }

  const assessmentPct =
    assessments.length > 0
      ? Math.min(60, doneCount * progressIncrementPerAssessment(courseId))
      : 0;

  const curriculumPct = progress.progressPercentage > assessmentPct
    ? progress.progressPercentage
    : Math.max(progress.progressPercentage, assessmentPct);

  progress = {
    ...progress,
    courseId,
    progressPercentage: Math.min(100, Math.max(curriculumPct, assessmentPct)),
    lastAssessmentAt: new Date(),
    graduationReady:
      progress.remainingSubjects.length === 0 &&
      doneCount >= assessments.length &&
      progress.progressPercentage >= 100,
  };

  return saveCourseProgress(userId, courseId, progress);
};

export const deleteCompletionsForCourse = async (
  userId: string,
  courseId: string
): Promise<void> => {
  if (!isFirebaseConfigured() || !(await ensureAuthReady(userId))) return;

  try {
    const all = await loadUserProgramAssessmentCompletions(userId);
    const toDelete = all.filter((c) => c.courseId === courseId);
    await Promise.all(
      toDelete.map((c) =>
        deleteDoc(completionDoc(userId, c.courseId, c.assessmentId))
      )
    );
  } catch (error) {
    console.error('[programAssessmentService] delete completions:', error);
  }
};

export const clearAllUserProgramAssessmentCompletions = async (
  userId: string
): Promise<void> => {
  if (!isFirebaseConfigured() || !(await ensureAuthReady(userId))) return;

  try {
    const db = getFirebaseDb()!;
    const snap = await getDocs(
      query(
        collection(db, 'programAssessmentCompletions'),
        where('userId', '==', userId)
      )
    );
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  } catch (error) {
    console.error('[programAssessmentService] clear all:', error);
  }
};
