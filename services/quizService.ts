import {
  COURSE_SCORING_MAP,
  COURSE_SCORING_WEIGHTS,
  PROGRAM_COURSE_IDS,
  SAMPLE_COURSES,
  SAMPLE_PROGRESS_DATA,
  QUIZ_QUESTIONS,
} from '../utils/constants';
import { Course, CourseRanking, QuizQuestion, Recommendation } from '../utils/types';
import { useCourseStore } from '../stores/courseStore';

const emptyScores = (): Record<string, number> =>
  Object.fromEntries(PROGRAM_COURSE_IDS.map((id) => [id, 0]));

export const getQuizQuestions = (): QuizQuestion[] => {
  return useCourseStore.getState().quizQuestions;
};

export const getCurrentQuestion = (questionNumber: number): QuizQuestion | null => {
  const questions = getQuizQuestions();
  if (questionNumber >= 0 && questionNumber < questions.length) {
    return questions[questionNumber];
  }
  return null;
};

export const getTotalQuestions = (): number => {
  return getQuizQuestions().length;
};

const getCourses = (): Course[] => {
  const fromStore = useCourseStore.getState().allCourses;
  return fromStore.length > 0 ? fromStore : SAMPLE_COURSES;
};

const getWeightsForAnswer = (
  question: QuizQuestion,
  answerIdx: number
): Partial<Record<string, number>> | undefined => {
  if (question.scoringWeights?.[answerIdx]) {
    return question.scoringWeights[answerIdx];
  }
  return COURSE_SCORING_WEIGHTS[question.id]?.[answerIdx];
};

/**
 * Sum weighted points per program (supports partial credit across programs).
 */
export const calculateCourseScores = (
  quizAnswers: Record<string, string>
): Record<string, number> => {
  const courseScores = emptyScores();
  const questions = getQuizQuestions();
  const questionById = Object.fromEntries(questions.map((q) => [q.id, q]));

  Object.entries(quizAnswers).forEach(([questionId, answerIndex]) => {
    const answerIdx = parseInt(answerIndex, 10);
    if (Number.isNaN(answerIdx)) return;

    const question = questionById[questionId];
    const weights = question
      ? getWeightsForAnswer(question, answerIdx)
      : COURSE_SCORING_WEIGHTS[questionId]?.[answerIdx];

    if (weights) {
      Object.entries(weights).forEach(([courseId, points]) => {
        courseScores[courseId] = (courseScores[courseId] || 0) + (points || 0);
      });
      return;
    }

    const legacyCourseId = COURSE_SCORING_MAP[questionId]?.[answerIdx];
    if (legacyCourseId) {
      courseScores[legacyCourseId] = (courseScores[legacyCourseId] || 0) + 1;
      return;
    }

    const fallbackId = PROGRAM_COURSE_IDS[answerIdx % PROGRAM_COURSE_IDS.length];
    courseScores[fallbackId] = (courseScores[fallbackId] || 0) + 1;
  });

  return courseScores;
};

export interface RankedCourse {
  courseId: string;
  course: Course;
  score: number;
  matchPercent: number;
}

export const getRankedCourses = (
  quizAnswers: Record<string, string>
): RankedCourse[] => {
  const scores = calculateCourseScores(quizAnswers);
  const courses = getCourses();
  const total = Object.values(scores).reduce((sum, n) => sum + n, 0) || 1;

  return PROGRAM_COURSE_IDS.map((courseId) => {
    const course = courses.find((c) => c.id === courseId)!;
    const score = scores[courseId] || 0;
    return {
      courseId,
      course,
      score,
      matchPercent: Math.max(0, Math.round((score / total) * 100)),
    };
  }).sort((a, b) => b.score - a.score);
};

export const getCourseRankings = (
  quizAnswers: Record<string, string>
): CourseRanking[] =>
  getRankedCourses(quizAnswers).map(({ courseId, score, matchPercent }) => ({
    courseId,
    score,
    matchPercent,
  }));

export const getBestMatchingCourse = (quizAnswers: Record<string, string>) => {
  const ranked = getRankedCourses(quizAnswers);
  return ranked[0]?.course || getCourses()[0];
};

export const generateStrengths = (quizAnswers: Record<string, string>): string[] => {
  const ranked = getRankedCourses(quizAnswers);
  const topIds = ranked.slice(0, 2).map((r) => r.courseId);

  const strengthsMap: Record<string, string[]> = {
    hospitality: [
      'Strong interpersonal and service mindset',
      'Comfort leading people and operations',
    ],
    it: [
      'Logical problem-solving and technical curiosity',
      'Adaptable with digital tools and systems',
    ],
    criminal_justice: [
      'Ethical judgment and attention to detail',
      'Drive for public service and community impact',
    ],
  };

  const combined = topIds.flatMap((id) => strengthsMap[id] || []);
  return combined.length > 0 ? combined.slice(0, 4) : strengthsMap.it;
};

export const filterCoursesByProfile = (_quizAnswers: Record<string, string>) => {
  return getCourses();
};

export const getProgressForCourse = (courseId: string) => {
  return SAMPLE_PROGRESS_DATA[courseId as keyof typeof SAMPLE_PROGRESS_DATA] || null;
};

const rankLabels = ['Top match', 'Strong alternative', 'Also consider'];

export const buildRecommendation = (
  quizAnswers: Record<string, string>,
  ranked?: RankedCourse,
  rankIndex = 0
): Recommendation => {
  const entry = ranked ?? getRankedCourses(quizAnswers)[rankIndex];
  const { course, matchPercent } = entry;
  const label = rankLabels[rankIndex] || 'Program fit';

  const description =
    rankIndex === 0
      ? `Your answers show the strongest alignment with ${course.title} (${matchPercent}% fit across all three programs). You can still explore the other programs below.`
      : `You also have a ${matchPercent}% fit with ${course.title}. Many students compare multiple paths before enrolling.`;

  return {
    id: `rec-${course.id}-${Date.now()}-${rankIndex}`,
    title: `${label}: ${course.title}`,
    description,
    estimatedDuration: course.duration,
    difficulty: course.difficulty,
    courses: [course],
    requiredSkills: course.skills,
    careerApplications: course.careerPaths,
    matchPercent,
  };
};

/** Ranked recommendations for every program (not just the winner). */
export const buildAllRecommendations = (
  quizAnswers: Record<string, string>
): Recommendation[] => {
  return getRankedCourses(quizAnswers).map((ranked, index) =>
    buildRecommendation(quizAnswers, ranked, index)
  );
};

/** Default questions include scoring weights (for local / seed fallback). */
export const getDefaultQuizQuestions = (): QuizQuestion[] => QUIZ_QUESTIONS;
