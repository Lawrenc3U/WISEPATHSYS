import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../utils/theme';

// Screens
import AssessmentQuizScreen from '../screens/AssessmentQuizScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Types
import { RootStackParamList } from './types';

// Services
import { loadCoursesFromFirebase } from '../services/firebase';
import { useCourseStore } from '../stores/courseStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: {
    backgroundColor: colors.background,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: '600' as const,
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: colors.background,
  },
};

const RootNavigator: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const setAllCourses = useCourseStore((state) => state.setAllCourses);

  // Initialize app - load courses from Firebase
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const courses = await loadCoursesFromFirebase();
        setAllCourses(courses);
        setIsReady(true);
      } catch (error) {
        console.error('[RootNavigator] Error initializing app:', error);
        // Still set ready even if there's an error, so app can continue with sample data
        setIsReady(true);
      }
    };

    initializeApp();
  }, [setAllCourses]);

  if (!isReady) {
    return <LoadingSpinner message="Initializing WisePath..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="AssessmentQuiz"
          component={AssessmentQuizScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Recommendations"
          component={RecommendationsScreen}
          options={{
            headerTitle: 'Your Learning Paths',
          }}
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{
            headerTitle: 'Course Details',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerTitle: 'Your Profile',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
