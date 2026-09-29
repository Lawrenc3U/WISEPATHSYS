import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ProfileSetup: { mode?: 'edit' } | undefined;
  Start: undefined;
  Dashboard: undefined;
  AssessmentQuiz: undefined;
  Recommendations: undefined;
  CourseDetail: { courseId: string };
  Progress: { courseId: string };
  Profile: undefined;
  AdminDashboard: undefined;
  AdminCourses: undefined;
  AdminAssessments: undefined;
  AdminData: undefined;
};

export type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = StackScreenProps<RootStackParamList, 'Register'>;
export type ProfileSetupScreenProps = StackScreenProps<
  RootStackParamList,
  'ProfileSetup'
>;
export type StartScreenProps = StackScreenProps<RootStackParamList, 'Start'>;
export type DashboardScreenProps = StackScreenProps<
  RootStackParamList,
  'Dashboard'
>;
export type AssessmentQuizScreenProps = StackScreenProps<
  RootStackParamList,
  'AssessmentQuiz'
>;
export type RecommendationsScreenProps = StackScreenProps<
  RootStackParamList,
  'Recommendations'
>;
export type CourseDetailScreenProps = StackScreenProps<
  RootStackParamList,
  'CourseDetail'
>;
export type ProgressScreenProps = StackScreenProps<RootStackParamList, 'Progress'>;
export type ProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>;
export type AdminDashboardScreenProps = StackScreenProps<
  RootStackParamList,
  'AdminDashboard'
>;
export type AdminCoursesScreenProps = StackScreenProps<
  RootStackParamList,
  'AdminCourses'
>;
export type AdminAssessmentsScreenProps = StackScreenProps<
  RootStackParamList,
  'AdminAssessments'
>;
export type AdminDataScreenProps = StackScreenProps<RootStackParamList, 'AdminData'>;
