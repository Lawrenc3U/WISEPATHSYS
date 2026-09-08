import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { RecommendationItem } from '../components/RecommendationItem';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useUserStore } from '../stores/userStore';
import { useCourseStore } from '../stores/courseStore';
import { SAMPLE_COURSES } from '../utils/constants';
import { RecommendationsScreenProps } from '../navigation/types';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { getAIAnalysis } from '../services/aiService';

const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const currentRecommendations = useUserStore(
    (state) => state.currentRecommendations
  );
  const setSelectedCourseId = useUserStore((state) => state.setSelectedCourseId);

  const userProfile = useUserStore((state) => state.userProfile);

  const recommendations = currentRecommendations;
  const latestQuiz = userProfile?.quizHistory?.[userProfile.quizHistory.length - 1];

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (userProfile && latestQuiz && latestQuiz.courseRankings) {
        setIsAiLoading(true);
        try {
          const analysis = await getAIAnalysis(userProfile, latestQuiz.courseRankings, SAMPLE_COURSES);
          setAiAnalysis(analysis);
        } catch (error) {
          console.error('Failed to fetch AI analysis:', error);
          setAiAnalysis('Could not load AI analysis at this time.');
        } finally {
          setIsAiLoading(false);
        }
      } else {
        setIsAiLoading(false);
      }
    };
    fetchAnalysis();
  }, [userProfile, latestQuiz]);

  const handleCoursePress = (courseId: string) => {
    setSelectedCourseId(courseId);
    navigation.navigate('CourseDetail', { courseId });
  };

  const handleEnroll = () => {
    if (recommendations[0]?.courses[0]) {
      handleCoursePress(recommendations[0].courses[0].id);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Generating recommendations..." />;
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No recommendations found</Text>
          <Text style={styles.emptyText}>
            Please complete the assessment to get personalized recommendations.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper gradient>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedFadeIn index={0}>
        <View style={styles.header}>
          <Text style={styles.title}>Your program fit results</Text>
          <Text style={styles.subtitle}>
            All three programs ranked from your answers — pick any path to explore
          </Text>
        </View>
        </AnimatedFadeIn>

        {/* AI Analysis Section */}
        <AnimatedFadeIn index={0.5}>
          <View style={styles.aiSection}>
            <View style={styles.aiHeaderRow}>
              <Sparkles size={20} color={colors.primary} />
              <Text style={styles.aiTitle}>AI Guidance Counselor</Text>
            </View>
            {isAiLoading ? (
              <LoadingSpinner message="Analyzing your profile..." />
            ) : (
              <Text style={styles.aiText}>{aiAnalysis}</Text>
            )}
          </View>
        </AnimatedFadeIn>

        {recommendations.slice(0, 3).map((rec, index) => (
          <AnimatedFadeIn key={rec.id} index={index + 1}>
            <View style={styles.topRecommendation}>
              <RecommendationItem
                recommendation={rec}
                onPress={() => {
                  if (rec.courses[0]) {
                    handleCoursePress(rec.courses[0].id);
                  }
                }}
              />
            </View>
          </AnimatedFadeIn>
        ))}

        <AnimatedFadeIn index={recommendations.length + 1}>
        <View style={styles.allCoursesSection}>
          <Text style={styles.sectionTitle}>Browse program details</Text>
          <Text style={styles.sectionSubtitle}>
            Compare curriculum, careers, and skills for each degree
          </Text>

          <View style={styles.coursesList}>
            {SAMPLE_COURSES.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() => handleCoursePress(course.id)}
                activeOpacity={0.7}
              >
                <View style={styles.courseCardHeader}>
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseDuration}>{course.duration}</Text>
                  </View>
                  <ChevronRight
                    size={24}
                    color={colors.primary}
                    strokeWidth={2}
                  />
                </View>

                <Text style={styles.courseDescription} numberOfLines={2}>
                  {course.description}
                </Text>

                <View style={styles.courseStats}>
                  <StatPill label="Careers" value={course.careerPaths.length} />
                  <StatPill label="Skills" value={course.skills.length} />
                  <StatPill label="Duration" value={course.duration} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={recommendations.length + 2}>
        <View style={styles.ctaSection}>
          <PrimaryButton label="View top match" onPress={handleEnroll} />
          <PrimaryButton
            label="Go to Dashboard"
            onPress={() => navigation.navigate('Dashboard')}
            variant="outline"
            style={{ marginTop: spacing.md }}
          />
        </View>
        </AnimatedFadeIn>
      </ScrollView>
    </ScreenWrapper>
  );
};

interface StatPillProps {
  label: string;
  value: string | number;
}

const StatPill: React.FC<StatPillProps> = ({ label, value }) => (
  <View style={styles.statPill}>
    <Text style={styles.statPillText}>
      {label}: {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.text,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  aiSection: {
    backgroundColor: '#F0F9FF',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  aiTitle: {
    fontSize: typography.sizes.base,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  aiText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: 22,
  },
  topRecommendation: {
    marginBottom: spacing.xl,
  },
  allCoursesSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  coursesList: {
    gap: spacing.md,
  },
  courseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  courseInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  courseTitle: {
    fontSize: typography.sizes.base,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  courseDuration: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  courseDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  courseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statPill: {
    backgroundColor: colors.text,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  statPillText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  ctaSection: {
    gap: spacing.md,
  },
  enrollButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  enrollButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: 'bold',
    color: colors.text,
  },
  backButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  backButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default RecommendationsScreen;
