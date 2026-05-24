export type UserRole = 'student' | 'admin';

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
  learningGoals: string;
  currentSkills: string;
  learningStyle: string;
  experience: string;
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
