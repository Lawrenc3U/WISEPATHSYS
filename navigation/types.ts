import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ProfileSetup: undefined;
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

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type ProfileSetupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProfileSetup'
>;
export type StartScreenProps = NativeStackScreenProps<RootStackParamList, 'Start'>;
export type DashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Dashboard'
>;
export type AssessmentQuizScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AssessmentQuiz'
>;
export type RecommendationsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Recommendations'
>;
export type CourseDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CourseDetail'
>;
export type ProgressScreenProps = NativeStackScreenProps<RootStackParamList, 'Progress'>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
export type AdminDashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AdminDashboard'
>;
export type AdminCoursesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AdminCourses'
>;
export type AdminAssessmentsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AdminAssessments'
>;
export type AdminDataScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminData'>;
