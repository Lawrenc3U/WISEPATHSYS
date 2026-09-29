import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
import { seedFirestoreIfEmpty } from '../services/seedService';
import { loadAllCourseProgress } from '../services/progressService';
import { useCourseStore } from '../stores/courseStore';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { UserAccount } from '../utils/types';

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surfaceElevated },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '600' as const },
  headerShadowVisible: false,
  cardStyle: { backgroundColor: colors.background, flex: 1 },
  // Avoid Reanimated-powered card transitions (broken in current Expo Go setup)
  animationEnabled: false,
  gestureEnabled: true,
};

const getInitialRoute = (
  account: UserAccount | null
): keyof RootStackParamList => {
  if (!account) return 'Login';
  if (account.role === 'admin') return 'AdminDashboard';
  if (!account.profileComplete) return 'ProfileSetup';
  return 'Dashboard';
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
  const resetUserSession = useUserStore((state) => state.resetUserSession);
  const setProgressByCourse = useUserStore((state) => state.setProgressByCourse);

  useEffect(() => {
    // Never leave the UI stuck on the loader if auth is slow/hung.
    const failSafe = setTimeout(() => {
      setLoading(false);
      setIsReady(true);
    }, 8000);
    return () => clearTimeout(failSafe);
  }, [setLoading]);

  useEffect(() => {
    let cancelled = false;

    const initializeApp = async () => {
      try {
        ensureFirebaseInitialized();
        if (isFirebaseConfigured()) {
          console.log(`[WisePath] Firebase active: ${getFirebaseProjectId()}`);
        }

        const [courses, questions] = await Promise.all([
          loadCoursesFromFirebase(),
          loadQuizQuestionsFromFirebase(),
        ]);
        if (cancelled) return;
        setAllCourses(courses);
        setQuizQuestions(questions);
      } catch (error) {
        console.error('[RootNavigator] Init error:', error);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    };

    initializeApp();
    return () => {
      cancelled = true;
    };
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
          if (userAccount.role === 'admin') {
            const seeded = await seedFirestoreIfEmpty();
            if (seeded.seededCourses || seeded.seededQuestions) {
              const [courses, questions] = await Promise.all([
                loadCoursesFromFirebase(),
                loadQuizQuestionsFromFirebase(),
              ]);
              if (!active) return;
              setAllCourses(courses);
              setQuizQuestions(questions);
            }
          }
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
      } catch (error) {
        console.error('[RootNavigator] Auth hydrate error:', error);
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
  }, [
    setAccount,
    setLoading,
    hydrateFromAccount,
    resetUserSession,
    setProgressByCourse,
    setAllCourses,
    setQuizQuestions,
  ]);

  if (!isReady || isLoading) {
    return <LoadingSpinner message="Initializing WisePath..." />;
  }

  const initialRoute = getInitialRoute(account);
  const navKey = account ? `in-${account.uid}` : 'out';

  return (
    <NavigationContainer key={navKey}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={screenOptions}
      >
        {!account ? (
          <>
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
          </>
        ) : (
          <>
            <Stack.Screen
              name="ProfileSetup"
              component={ProfileSetupScreen}
              options={({ route }) => ({
                title:
                  route.params?.mode === 'edit' ? 'Edit Profile' : 'Your Profile',
                headerLeft: route.params?.mode === 'edit' ? undefined : () => null,
              })}
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
              options={{ title: 'Assessment Quiz' }}
            />
            <Stack.Screen
              name="Recommendations"
              component={RecommendationsScreen}
              options={{ title: 'Recommendations' }}
            />
            <Stack.Screen
              name="CourseDetail"
              component={CourseDetailScreen}
              options={{ title: 'Course Details' }}
            />
            <Stack.Screen
              name="Progress"
              component={ProgressTrackingScreen}
              options={{ title: 'Academic Progress' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Your Profile' }}
            />
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminCourses"
              component={AdminCoursesScreen}
              options={{ title: 'Course Management' }}
            />
            <Stack.Screen
              name="AdminAssessments"
              component={AdminAssessmentsScreen}
              options={{ title: 'Assessment Management' }}
            />
            <Stack.Screen
              name="AdminData"
              component={AdminDataScreen}
              options={{ title: 'Data & Recommendations' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
