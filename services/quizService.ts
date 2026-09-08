import {
  COURSE_SCORING_MAP,
  COURSE_SCORING_WEIGHTS,
  PROGRAM_COURSE_IDS,
  SAMPLE_COURSES,
  SAMPLE_PROGRESS_DATA,
  QUIZ_QUESTIONS,
} from '../utils/constants';
import {
  Course,
  CourseRanking,
  QuizQuestion,
  Recommendation,
  UserProfile,
} from '../utils/types';
import { useCourseStore } from '../stores/courseStore';

const emptyScores = (): Record<string, number> =>
  Object.fromEntries(PROGRAM_COURSE_IDS.map((id) => [id, 0]));

/** Map career interest labels → program score bonuses */
const CAREER_INTEREST_WEIGHTS: Record<string, Partial<Record<string, number>>> = {
  'Hospitality & Tourism': { hospitality: 5, tourism_management: 5 },
  'Information Technology & Computing': {
    it: 5,
    computer_science: 5,
    mathematics: 1,
  },
  'Law Enforcement & Public Safety': { criminal_justice: 5 },
  'Business & Entrepreneurship': {
    business_financial_management: 4,
    business_marketing_management: 4,
    accountancy: 2,
    management_accounting: 3,
    hospitality: 1,
  },
  'Healthcare & Wellness': { psychology: 4, physical_education: 2 },
  'Education & Teaching': {
    early_childhood_education: 4,
    elementary_education: 4,
    secondary_education_english: 4,
    secondary_education_filipino: 4,
    physical_education: 3,
  },
  'Engineering & Technical Trades': {
    civil_engineering: 5,
    mechanical_engineering: 5,
    electrical_engineering: 5,
  },
  'Arts, Media & Design': {
    communication: 4,
    english_language: 3,
    business_marketing_management: 1,
  },
  'Government & Public Service': {
    criminal_justice: 4,
    communication: 2,
    psychology: 1,
  },
  'Science & Research': {
    mathematics: 5,
    computer_science: 3,
    psychology: 2,
    civil_engineering: 1,
    mechanical_engineering: 1,
    electrical_engineering: 1,
  },
};

const SHS_STRAND_WEIGHTS: Record<string, Partial<Record<string, number>>> = {
  STEM: {
    computer_science: 3,
    it: 3,
    mathematics: 3,
    civil_engineering: 3,
    mechanical_engineering: 3,
    electrical_engineering: 3,
  },
  ABM: {
    business_financial_management: 3,
    business_marketing_management: 3,
    accountancy: 3,
    management_accounting: 3,
    hospitality: 2,
    tourism_management: 2,
  },
  HUMSS: {
    criminal_justice: 2,
    communication: 3,
    psychology: 3,
    english_language: 3,
    early_childhood_education: 2,
    elementary_education: 2,
    secondary_education_english: 2,
    secondary_education_filipino: 2,
  },
  GAS: Object.fromEntries(PROGRAM_COURSE_IDS.map((id) => [id, 0.5])),
  TVL: { it: 2, hospitality: 1, tourism_management: 1 },
  'TVL – ICT': { it: 3, computer_science: 2 },
  'TVL – Home Economics': { hospitality: 3, tourism_management: 2 },
  'TVL – Industrial Arts': {
    civil_engineering: 2,
    mechanical_engineering: 2,
    electrical_engineering: 2,
  },
  'TVL – Agri-Fishery Arts': { hospitality: 1, tourism_management: 1 },
  'Arts and Design': { communication: 3, english_language: 2 },
  Sports: { physical_education: 3 },
};

const LEARNING_GOAL_WEIGHTS: Record<string, Partial<Record<string, number>>> = {
  'Gain hands-on skills for immediate employment': {
    hospitality: 1,
    it: 1,
    criminal_justice: 1,
  },
  "Prepare for advanced studies (e.g. Master's, Law, Med)": {
    criminal_justice: 2,
    it: 1,
  },
  'Build a strong theoretical foundation': { it: 1, criminal_justice: 1 },
  'Learn leadership and management skills': {
    hospitality: 2,
    tourism_management: 2,
    business_financial_management: 2,
    business_marketing_management: 2,
  },
  'Master technical or digital tools': {
    it: 3,
    computer_science: 3,
    mathematics: 1,
  },
  'Improve communication and soft skills': {
    hospitality: 2,
    tourism_management: 2,
    communication: 3,
    english_language: 2,
    psychology: 1,
  },
  'Understand industry standards and ethics': {
    criminal_justice: 2,
    accountancy: 2,
    management_accounting: 1,
  },
  'Explore personal interests before committing': {
    hospitality: 1,
    it: 1,
    criminal_justice: 1,
  },
};

/** Relates the three assessment dimensions to the complete program catalog. */
const ASSESSMENT_AFFINITY: Record<
  string,
  Partial<Record<'hospitality' | 'it' | 'criminal_justice', number>>
> = {
  computer_science: { it: 0.95 },
  it: { it: 1 },
  civil_engineering: { it: 0.6 },
  mechanical_engineering: { it: 0.6 },
  electrical_engineering: { it: 0.65 },
  business_financial_management: { hospitality: 0.35, it: 0.2 },
  business_marketing_management: { hospitality: 0.5 },
  accountancy: { it: 0.4, criminal_justice: 0.15 },
  management_accounting: { it: 0.4, hospitality: 0.15 },
  hospitality: { hospitality: 1 },
  communication: { hospitality: 0.55, criminal_justice: 0.2 },
  psychology: { criminal_justice: 0.45, hospitality: 0.3 },
  english_language: { hospitality: 0.35, criminal_justice: 0.2 },
  mathematics: { it: 0.75 },
  physical_education: { hospitality: 0.4, criminal_justice: 0.25 },
  early_childhood_education: { hospitality: 0.4 },
  elementary_education: { hospitality: 0.4, criminal_justice: 0.15 },
  secondary_education_english: { hospitality: 0.35, criminal_justice: 0.2 },
  secondary_education_filipino: { hospitality: 0.35, criminal_justice: 0.2 },
  tourism_management: { hospitality: 0.9 },
  criminal_justice: { criminal_justice: 1 },
};

const getAffordabilityScore = (
  profile: UserProfile | null | undefined,
  course: Course
): number => {
  const income = profile?.parentalIncomeLevel;
  const tuition = course.estimatedTuitionPerTerm;
  if (!income || income === 'prefer_not_to_say' || !tuition) return 0;

  const lowerCostRange = tuition.startsWith('₱25,000');
  const higherCostRange = tuition.startsWith('₱30,000');

  if (income === 'below_10k') return lowerCostRange ? 2.5 : higherCostRange ? 1 : 0;
  if (income === '10k_20k') return lowerCostRange ? 2 : higherCostRange ? 0.75 : 0;
  if (income === '20k_40k') return lowerCostRange ? 1 : higherCostRange ? 0.5 : 0;
  return 0;
};

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
  if (fromStore.length === 0) return SAMPLE_COURSES;

  // Keep current Firestore content while filling new catalog metadata such as tuition.
  return SAMPLE_COURSES.map((fallback) => {
    const stored = fromStore.find((course) => course.id === fallback.id);
    const estimatedTuitionPerTerm =
      stored?.estimatedTuitionPerTerm || fallback.estimatedTuitionPerTerm;

    return {
      ...fallback,
      ...(stored || {}),
      ...(estimatedTuitionPerTerm ? { estimatedTuitionPerTerm } : {}),
    };
  });
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

const addWeights = (
  scores: Record<string, number>,
  weights?: Partial<Record<string, number>>
) => {
  if (!weights) return;
  Object.entries(weights).forEach(([courseId, points]) => {
    scores[courseId] = (scores[courseId] || 0) + (points || 0);
  });
};

/**
 * Score programs from create-profile answers (interests, strand, goals, etc.).
 */
export const calculateProfileScores = (
  profile?: UserProfile | null
): Record<string, number> => {
  const scores = emptyScores();
  if (!profile) return scores;

  (profile.careerInterests || []).forEach((interest) => {
    addWeights(scores, CAREER_INTEREST_WEIGHTS[interest]);
  });

  const strand = profile.shsStrand || profile.seniorHighStrand;
  if (strand) {
    addWeights(scores, SHS_STRAND_WEIGHTS[strand]);
    if (!SHS_STRAND_WEIGHTS[strand] && strand.startsWith('TVL')) {
      addWeights(scores, SHS_STRAND_WEIGHTS.TVL);
    }
  }

  const goals = Array.isArray(profile.learningGoals)
    ? profile.learningGoals
    : profile.learningGoals
      ? [String(profile.learningGoals)]
      : [];
  goals.forEach((goal) => addWeights(scores, LEARNING_GOAL_WEIGHTS[goal]));

  if (profile.currentSkills === 'Advanced') {
    addWeights(scores, { it: 1, hospitality: 1, criminal_justice: 1 });
  }
  if (profile.learningStyle === 'Hands-on') {
    addWeights(scores, { hospitality: 1, it: 1 });
  }
  if (profile.learningStyle === 'Reading') {
    addWeights(scores, { criminal_justice: 1, it: 1 });
  }

  return scores;
};

/**
 * Sum weighted points per program from assessment answers.
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
      addWeights(courseScores, weights);
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

/**
 * Combine profile intake + assessment quiz into one ranking score.
 */
export const calculateCombinedScores = (
  quizAnswers: Record<string, string>,
  profile?: UserProfile | null
): Record<string, number> => {
  const quizScores = calculateCourseScores(quizAnswers);
  const profileScores = calculateProfileScores(profile);
  const combined = emptyScores();
  const courses = getCourses();

  PROGRAM_COURSE_IDS.forEach((id) => {
    const affinity = ASSESSMENT_AFFINITY[id] || {};
    const assessmentScore = Object.entries(affinity).reduce(
      (total, [dimension, multiplier]) =>
        total + (quizScores[dimension] || 0) * (multiplier || 0),
      0
    );
    const course = courses.find((item) => item.id === id);
    combined[id] =
      assessmentScore +
      (profileScores[id] || 0) * 0.85 +
      (course ? getAffordabilityScore(profile, course) : 0);
  });

  return combined;
};

export interface RankedCourse {
  courseId: string;
  course: Course;
  score: number;
  matchPercent: number;
}

export const getRankedCourses = (
  quizAnswers: Record<string, string>,
  profile?: UserProfile | null
): RankedCourse[] => {
  const scores = calculateCombinedScores(quizAnswers, profile);
  const courses = getCourses();
  const rankedScores = Object.values(scores).sort((a, b) => b - a);
  const topThreeTotal =
    rankedScores.slice(0, 3).reduce((sum, value) => sum + value, 0) || 1;

  return PROGRAM_COURSE_IDS.map((courseId) => {
    const course = courses.find((c) => c.id === courseId)!;
    const score = scores[courseId] || 0;
    return {
      courseId,
      course,
      score,
      matchPercent: Math.max(0, Math.round((score / topThreeTotal) * 100)),
    };
  }).sort((a, b) => b.score - a.score);
};

export const getCourseRankings = (
  quizAnswers: Record<string, string>,
  profile?: UserProfile | null
): CourseRanking[] =>
  getRankedCourses(quizAnswers, profile).map(
    ({ courseId, score, matchPercent }) => ({
      courseId,
      score,
      matchPercent,
    })
  );

export const getBestMatchingCourse = (
  quizAnswers: Record<string, string>,
  profile?: UserProfile | null
) => {
  const ranked = getRankedCourses(quizAnswers, profile);
  return ranked[0]?.course || getCourses()[0];
};

export const generateStrengths = (
  quizAnswers: Record<string, string>,
  profile?: UserProfile | null
): string[] => {
  const ranked = getRankedCourses(quizAnswers, profile);
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

  const fromProfile: string[] = [];
  if (profile?.careerInterests?.length) {
    fromProfile.push(
      `Interests aligned with ${profile.careerInterests.slice(0, 2).join(' & ')}`
    );
  }
  if (profile?.learningGoals?.length) {
    const goal = Array.isArray(profile.learningGoals)
      ? profile.learningGoals[0]
      : String(profile.learningGoals);
    fromProfile.push(`Motivated by: ${goal}`);
  }

  const combined = [
    ...fromProfile,
    ...topIds.flatMap((id) => strengthsMap[id] || []),
  ];
  return combined.length > 0 ? combined.slice(0, 4) : strengthsMap.it;
};

export const filterCoursesByProfile = (_quizAnswers: Record<string, string>) => {
  return getCourses();
};

export const getProgressForCourse = (courseId: string) => {
  return SAMPLE_PROGRESS_DATA[courseId as keyof typeof SAMPLE_PROGRESS_DATA] || null;
};

const rankLabels = ['Top match', '2nd match', '3rd match'];

export const buildRecommendation = (
  quizAnswers: Record<string, string>,
  ranked?: RankedCourse,
  rankIndex = 0,
  profile?: UserProfile | null
): Recommendation => {
  const entry = ranked ?? getRankedCourses(quizAnswers, profile)[rankIndex];
  const { course, matchPercent } = entry;
  const label = rankLabels[rankIndex] || 'Program fit';
  const includesAffordability =
    Boolean(profile?.parentalIncomeLevel) &&
    profile?.parentalIncomeLevel !== 'prefer_not_to_say';
  const recommendationBasis = includesAffordability
    ? 'your profile, assessment, and estimated affordability'
    : 'your profile and assessment';

  const description =
    rankIndex === 0
      ? `Based on ${recommendationBasis}, ${course.title} is your strongest fit.`
      : `${course.title} is also a strong option based on ${recommendationBasis}.`;

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

/** Top 3 ranked recommendations from profile + assessment. */
export const buildAllRecommendations = (
  quizAnswers: Record<string, string>,
  profile?: UserProfile | null
): Recommendation[] => {
  return getRankedCourses(quizAnswers, profile)
    .slice(0, 3)
    .map((ranked, index) =>
      buildRecommendation(quizAnswers, ranked, index, profile)
    );
};

/** Default questions include scoring weights (for local / seed fallback). */
export const getDefaultQuizQuestions = (): QuizQuestion[] => QUIZ_QUESTIONS;
