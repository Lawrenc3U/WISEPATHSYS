export type UserRole = 'student' | 'admin';

export type StudentStatus = 'incoming' | 'current';
export type ResidenceType = 'urban' | 'rural';
export type ParentalIncomeLevel =
  | 'below_10k'
  | '10k_20k'
  | '20k_40k'
  | '40k_70k'
  | 'above_70k'
  | 'prefer_not_to_say';

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'multipleChoice' | 'scale';
  options?: string[];
  maxScale?: number;
  /** Per-option weights per course id (multi-program scoring) */
  scoringWeights?: Array<Partial<Record<string, number>>>;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  skills: string[];
  careerPaths: string[];
  curriculum: string[];
}

/** Short program-specific assessment (separate from the global career quiz) */
export interface ProgramAssessment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface ProgramAssessmentCompletion {
  userId: string;
  courseId: string;
  assessmentId: string;
  score?: number;
  isFitted?: boolean;
  completedAt: Date;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  courses: Course[];
  requiredSkills: string[];
  careerApplications: string[];
  /** Fit score vs other programs (0–100) */
  matchPercent?: number;
}

export interface CourseRanking {
  courseId: string;
  score: number;
  matchPercent: number;
}

export interface QuizResult {
  id?: string;
  userId?: string;
  quizAnswers: Record<string, string>;
  strengths: string[];
  recommendedPaths: Recommendation[];
  courseRankings?: CourseRanking[];
  bestCourseId?: string;
  completedAt: Date;
}

export interface StudentProgress {
  courseId?: string;
  currentYearLevel: 1 | 2 | 3 | 4;
  currentSemester: 1 | 2;
  completedSubjects: string[];
  ongoingSubjects: string[];
  remainingSubjects: string[];
  progressPercentage: number;
  graduationReady: boolean;
  enrollmentDate: Date;
  expectedGraduationDate: Date;
  lastAssessmentAt?: Date;
}

export interface UserProfile {
  name: string;
  email?: string;
  learningGoals: string[];
  currentSkills: string;
  learningStyle: string;
  experience: string;

  /** Whether the student is entering college or already enrolled */
  studentStatus?: StudentStatus;
  /** SHS strand/track */
  shsStrand?: string;
  /** Legacy alias used by some screens */
  seniorHighStrand?: string;
  /** General weighted average / GPA */
  academicAverage?: string;
  residenceType?: ResidenceType;
  parentalIncomeLevel?: ParentalIncomeLevel;
  careerInterests?: string[];

  selectedPath?: Recommendation;
  quizHistory?: QuizResult[];
  progress?: StudentProgress;
}

export interface UserAccount {
  uid: string;
  email: string;
  role: UserRole;
  profileComplete: boolean;
  profile?: UserProfile;
  createdAt?: Date;
}
