import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from './firebase';
import { Course, QuizQuestion, QuizResult } from '../utils/types';
import { QUIZ_QUESTIONS, SAMPLE_COURSES } from '../utils/constants';
import { loadAllAssessments } from './userDataService';

/** Use bundled multi-program question when Firestore still has legacy single-program items */
export const mergeQuizQuestionDefaults = (question: QuizQuestion): QuizQuestion => {
  const defaults = QUIZ_QUESTIONS.find((q) => q.id === question.id);
  if (!defaults) return question;
  if (question.scoringWeights?.length) {
    return { ...defaults, ...question };
  }
  return { ...defaults, id: question.id };
};

export const loadQuizQuestionsFromFirebase = async (): Promise<QuizQuestion[]> => {
  if (!isFirebaseConfigured()) return QUIZ_QUESTIONS;

  try {
    const db = getFirebaseDb()!;
    const snap = await getDocs(collection(db, 'quizQuestions'));
    if (snap.empty) return QUIZ_QUESTIONS;

    const merged = snap.docs.map((d) =>
      mergeQuizQuestionDefaults({ id: d.id, ...d.data() } as QuizQuestion)
    );
    const hasFullSet =
      merged.length >= QUIZ_QUESTIONS.length &&
      QUIZ_QUESTIONS.every((q) => merged.some((m) => m.id === q.id));
    return hasFullSet ? merged : QUIZ_QUESTIONS;
  } catch (error) {
    console.error('[adminService] loadQuizQuestions:', error);
    return QUIZ_QUESTIONS;
  }
};

export const saveCourse = async (course: Course): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  const db = getFirebaseDb()!;
  await setDoc(doc(db, 'courses', course.id), course);
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  const db = getFirebaseDb()!;
  await deleteDoc(doc(db, 'courses', courseId));
};

export const saveQuizQuestion = async (question: QuizQuestion): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  const db = getFirebaseDb()!;
  await setDoc(doc(db, 'quizQuestions', question.id), question);
};

export const deleteQuizQuestion = async (questionId: string): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  const db = getFirebaseDb()!;
  await deleteDoc(doc(db, 'quizQuestions', questionId));
};

export const getManagedCourses = async (): Promise<Course[]> => {
  if (!isFirebaseConfigured()) return SAMPLE_COURSES;

  try {
    const db = getFirebaseDb()!;
    const snap = await getDocs(collection(db, 'courses'));
    if (snap.empty) return SAMPLE_COURSES;

    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course));
  } catch {
    return SAMPLE_COURSES;
  }
};

export const getAssessmentRecords = async (): Promise<QuizResult[]> => {
  return loadAllAssessments();
};

export interface AdminActivityItem {
  id: string;
  type: 'assessment' | 'enrollment' | 'registration';
  title: string;
  subtitle: string;
  timestamp: Date;
}

export interface AdminOverviewStats {
  totalStudents: number;
  activeAssessments: number;
  totalAssessments: number;
  completionRate: number;
  totalCourses: number;
  recentActivity: AdminActivityItem[];
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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

export const loadAdminOverviewStats = async (): Promise<AdminOverviewStats> => {
  const empty: AdminOverviewStats = {
    totalStudents: 0,
    activeAssessments: 0,
    totalAssessments: 0,
    completionRate: 0,
    totalCourses: SAMPLE_COURSES.length,
    recentActivity: [],
  };

  if (!isFirebaseConfigured()) {
    return {
      ...empty,
      totalStudents: 12,
      activeAssessments: 5,
      totalAssessments: 18,
      completionRate: 67,
      totalCourses: SAMPLE_COURSES.length,
      recentActivity: [
        {
          id: 'demo-1',
          type: 'assessment',
          title: 'Assessment completed',
          subtitle: 'Top match: Information Technology',
          timestamp: new Date(),
        },
      ],
    };
  }

  try {
    const db = getFirebaseDb()!;
    const now = Date.now();
    const cutoff = now - THIRTY_DAYS_MS;

    const [usersSnap, coursesSnap, assessments, progressSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'courses')),
      loadAllAssessments(),
      getDocs(collection(db, 'courseProgress')),
    ]);

    const emailByUid: Record<string, string> = {};
    let totalStudents = 0;

    usersSnap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const role = data.role || 'student';
      if (role === 'admin') return;
      totalStudents += 1;
      emailByUid[docSnap.id] = data.email || 'Student';
    });

    const totalAssessments = assessments.length;
    const activeAssessments = assessments.filter(
      (a) => toDate(a.completedAt).getTime() >= cutoff
    ).length;

    const studentsWithAssessment = new Set(
      assessments.map((a) => a.userId).filter(Boolean)
    ).size;

    const completionRate =
      totalStudents > 0
        ? Math.round((studentsWithAssessment / totalStudents) * 100)
        : 0;

    const totalCourses = coursesSnap.empty
      ? SAMPLE_COURSES.length
      : coursesSnap.size;

    const activity: AdminActivityItem[] = [];

    assessments.forEach((record) => {
      const completedAt = toDate(record.completedAt);
      const email = record.userId ? emailByUid[record.userId] : 'Student';
      const topCourse =
        record.recommendedPaths?.[0]?.courses?.[0]?.title ||
        record.bestCourseId ||
        'Program ranked';
      activity.push({
        id: `assessment-${record.id || completedAt.getTime()}`,
        type: 'assessment',
        title: 'Assessment completed',
        subtitle: `${email} · ${topCourse}`,
        timestamp: completedAt,
      });
    });

    progressSnap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const updatedAt = toDate(data.updatedAt || data.enrollmentDate);
      const email = emailByUid[data.userId as string] || 'Student';
      const courseId = (data.courseId as string) || docSnap.id.split('__')[1];
      activity.push({
        id: `progress-${docSnap.id}`,
        type: 'enrollment',
        title: 'Course progress updated',
        subtitle: `${email} · ${courseId || 'program'}`,
        timestamp: updatedAt,
      });
    });

    usersSnap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.role === 'admin') return;
      const createdAt = toDate(data.createdAt);
      activity.push({
        id: `user-${docSnap.id}`,
        type: 'registration',
        title: 'New student registered',
        subtitle: data.email || docSnap.id,
        timestamp: createdAt,
      });
    });

    const recentActivity = activity
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalStudents,
      activeAssessments,
      totalAssessments,
      completionRate,
      totalCourses,
      recentActivity,
    };
  } catch (error) {
    console.error('[adminService] loadAdminOverviewStats:', error);
    return empty;
  }
};
