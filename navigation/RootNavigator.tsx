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
  isAuthSignOutInProgress,
} from '../services/authService';
import { loadUserAssessments } from '../services/userDataService';
import { loadAllCourseProgress } from '../services/progressService';
import { useCourseStore } from '../stores/courseStore';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { UserAccount } from '../utils/types';

const screenOptions = {
  headerStyle: { backgroundcolor: colors.text },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '600' as const },
  headerShadowVisible: false,
  contentStyle: { backgroundcolor: colors.text },
};

const AuthStack = createNativeStackNavigator<Pick<RootStackParamList, 'Login' | 'Register'>>();
type AppStackParamList = Omit<RootStackParamList, 'Login' | 'Register'>;
const AppStack = createNativeStackNavigator<AppStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={screenOptions} initialRouteName="Login">
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: 'Create Account' }}
    />
  </AuthStack.Navigator>
);

const getAppInitialRoute = (
  account: UserAccount
): keyof AppStackParamList => {
  if (account.role === 'admin') return 'AdminDashboard';
  if (!account.profileComplete) return 'ProfileSetup';
  return 'Dashboard';
};

const AppNavigator = ({ account }: { account: UserAccount }) => (
  <AppStack.Navigator
    screenOptions={screenOptions}
    initialRouteName={getAppInitialRoute(account)}
  >
    <AppStack.Screen
      name="ProfileSetup"
      component={ProfileSetupScreen}
      options={{ title: 'Your Profile', headerBackVisible: false }}
    />
    <AppStack.Screen
      name="Start"
      component={StartScreen}
      options={{ headerShown: false }}
    />
    <AppStack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
    <AppStack.Screen
      name="AssessmentQuiz"
      component={AssessmentQuizScreen}
      options={{ headerTitle: 'Assessment Quiz' }}
    />
    <AppStack.Screen
      name="Recommendations"
      component={RecommendationsScreen}
      options={{ headerTitle: 'Recommendations' }}
    />
    <AppStack.Screen
      name="CourseDetail"
      component={CourseDetailScreen}
      options={{ headerTitle: 'Course Details' }}
    />
    <AppStack.Screen
      name="Progress"
      component={ProgressTrackingScreen}
      options={{ headerTitle: 'Academic Progress' }}
    />
    <AppStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerTitle: 'Your Profile' }}
    />
    <AppStack.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{ headerShown: false }}
    />
    <AppStack.Screen
      name="AdminCourses"
      component={AdminCoursesScreen}
      options={{ headerTitle: 'Course Management' }}
    />
    <AppStack.Screen
      name="AdminAssessments"
      component={AdminAssessmentsScreen}
      options={{ headerTitle: 'Assessment Management' }}
    />
    <AppStack.Screen
      name="AdminData"
      component={AdminDataScreen}
      options={{ headerTitle: 'Data & Recommendations' }}
    />
  </AppStack.Navigator>
);

const RootNavigator: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const setAllCourses = useCourseStore((state) => state.setAllCourses);
  const setQuizQuestions = useCourseStore((state) => state.setQuizQuestions);
  const setAccount = useAuthStore((state) => state.setAccount);
  const setLoading = useAuthStore((state) => state.setLoading);
  const account = useAuthStore((state) => state.account);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hydrateFromAccount = useUserStore((state) => state.hydrateFromAccount);
  const resetUserSession = useUserStore((state) => state.resetUserSession);
  const setProgressByCourse = useUserStore((state) => state.setProgressByCourse);

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

    let active = true;

    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (!active) return;

      if (!user) {
        setAccount(null);
        resetUserSession();
        setLoading(false);
        return;
      }

      if (isAuthSignOutInProgress()) {
        setLoading(false);
        return;
      }

      try {
        const userAccount = await fetchUserAccount(user.uid);
        if (!active || isAuthSignOutInProgress()) return;

        if (userAccount) {
          setAccount(userAccount);
          const progressMap = await loadAllCourseProgress(user.uid);
          if (!active || isAuthSignOutInProgress()) return;
          setProgressByCourse(progressMap);
          if (userAccount.profile) {
            const history = await loadUserAssessments(user.uid);
            if (!active || isAuthSignOutInProgress()) return;
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
        if (active && !isAuthSignOutInProgress()) {
          setAccount(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [setAccount, setLoading, hydrateFromAccount, resetUserSession, setProgressByCourse]);

  if (!isReady || isLoading) {
    return <LoadingSpinner message="Initializing WisePath..." />;
  }

  const navKey = account ? `signed-in-${account.uid}` : 'signed-out';

  return (
    <NavigationContainer key={navKey}>
      {account ? <AppNavigator account={account} /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
