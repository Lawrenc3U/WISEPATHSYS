import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../utils/theme';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import StartScreen from '../screens/StartScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AssessmentQuizScreen from '../screens/AssessmentQuizScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import ProgramAssessmentScreen from '../screens/ProgramAssessmentScreen';
import ProgressTrackingScreen from '../screens/ProgressTrackingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminCoursesScreen from '../screens/AdminCoursesScreen';
import AdminAssessmentsScreen from '../screens/AdminAssessmentsScreen';
import AdminDataScreen from '../screens/AdminDataScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';

import { RootStackParamList } from './types';
import {
  loadCoursesFromFirebase,
  isFirebaseConfigured,
  getFirebaseProjectId,
  ensureFirebaseInitialized,
} from '../services/firebase';
import { loadQuizQuestionsFromFirebase } from '../services/adminService';
import {
  subscribeToAuthChanges,
  fetchUserAccount,
} from '../services/authService';
import { loadUserAssessments } from '../services/userDataService';
import { loadAllCourseProgress } from '../services/progressService';
import { loadUserProgramAssessmentCompletions } from '../services/programAssessmentService';
import { useCourseStore } from '../stores/courseStore';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '600' as const },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

const RootNavigator: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const setAllCourses = useCourseStore((state) => state.setAllCourses);
  const setQuizQuestions = useCourseStore((state) => state.setQuizQuestions);
  const setAccount = useAuthStore((state) => state.setAccount);
  const setLoading = useAuthStore((state) => state.setLoading);
  const account = useAuthStore((state) => state.account);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hydrateFromAccount = useUserStore((state) => state.hydrateFromAccount);
  const setProgressByCourse = useUserStore((state) => state.setProgressByCourse);
  const setProgramAssessmentCompletions = useUserStore(
    (state) => state.setProgramAssessmentCompletions
  );

  useEffect(() => {
    const initializeApp = async () => {
      try {
        ensureFirebaseInitialized();
        if (isFirebaseConfigured()) {
          console.log(
            `[WisePath] Firebase active: ${getFirebaseProjectId()}`
          );
        }

        const [courses, questions] = await Promise.all([
          loadCoursesFromFirebase(),
          loadQuizQuestionsFromFirebase(),
        ]);
        setAllCourses(courses);
        setQuizQuestions(questions);
      } catch (error) {
        console.error('[RootNavigator] Init error:', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeApp();
  }, [setAllCourses, setQuizQuestions]);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (!user) {
        setAccount(null);
        setLoading(false);
        return;
      }

      try {
        const userAccount = await fetchUserAccount(user.uid);
        if (userAccount) {
          setAccount(userAccount);
          const [progressMap, programCompletions] = await Promise.all([
            loadAllCourseProgress(user.uid),
            loadUserProgramAssessmentCompletions(user.uid),
          ]);
          setProgressByCourse(progressMap);
          setProgramAssessmentCompletions(programCompletions);
          if (userAccount.profile) {
            const history = await loadUserAssessments(user.uid);
            hydrateFromAccount(userAccount.profile, history);
          }
        } else {
          setAccount({
            uid: user.uid,
            email: user.email || '',
            role: 'student',
            profileComplete: false,
          });
        }
      } catch {
        setAccount(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [setAccount, setLoading, hydrateFromAccount]);

  if (!isReady || isLoading) {
    return <LoadingSpinner message="Initializing WisePath..." />;
  }

  const getInitialRoute = (): keyof RootStackParamList => {
    if (!account) return 'Login';
    if (account.role === 'admin') return 'AdminDashboard';
    if (!account.profileComplete) return 'ProfileSetup';
    return 'Dashboard';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName={getInitialRoute()}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Create Account' }}
        />
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetupScreen}
          options={{ title: 'Your Profile', headerBackVisible: false }}
        />

        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AssessmentQuiz"
          component={AssessmentQuizScreen}
          options={{ headerTitle: 'Assessment Quiz' }}
        />
        <Stack.Screen
          name="Recommendations"
          component={RecommendationsScreen}
          options={{ headerTitle: 'Recommendations' }}
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{ headerTitle: 'Course Details' }}
        />
        <Stack.Screen
          name="ProgramAssessment"
          component={ProgramAssessmentScreen}
          options={{ headerTitle: 'Program Assessment' }}
        />
        <Stack.Screen
          name="Progress"
          component={ProgressTrackingScreen}
          options={{ headerTitle: 'Academic Progress' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerTitle: 'Your Profile' }}
        />

        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminCourses"
          component={AdminCoursesScreen}
          options={{ headerTitle: 'Course Management' }}
        />
        <Stack.Screen
          name="AdminAssessments"
          component={AdminAssessmentsScreen}
          options={{ headerTitle: 'Assessment Management' }}
        />
        <Stack.Screen
          name="AdminData"
          component={AdminDataScreen}
          options={{ headerTitle: 'Data & Recommendations' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
