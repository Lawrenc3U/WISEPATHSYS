import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { RecommendationItem } from '../components/RecommendationItem';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useUserStore } from '../stores/userStore';
import { useCourseStore } from '../stores/courseStore';
import { RecommendationsScreenProps } from '../navigation/types';
import {
  ChevronRight,
  Sparkles,
  Trophy,
  LayoutDashboard,
} from 'lucide-react-native';
import { getAIAnalysis } from '../services/aiService';
import { PressableScale } from '../components/PressableScale';
import { EmptyStateSprite } from '../components/sprites';

const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  navigation,
}) => {
  const currentRecommendations = useUserStore(
    (state) => state.currentRecommendations
  );
  const setSelectedCourseId = useUserStore((state) => state.setSelectedCourseId);
  const userProfile = useUserStore((state) => state.userProfile);

  const quizHistory = useUserStore((state) => state.quizHistory);
  const catalog = useCourseStore((state) => state.getCatalog());

  const recommendations =
    currentRecommendations.length > 0
      ? currentRecommendations.slice(0, 3)
      : [...quizHistory]
          .sort(
            (a, b) =>
              new Date(b.completedAt).getTime() -
              new Date(a.completedAt).getTime()
          )[0]
          ?.recommendedPaths?.slice(0, 3) || [];
  const latestQuiz = [...quizHistory].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )[0];

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (userProfile && latestQuiz?.courseRankings) {
        setIsAiLoading(true);
        try {
          const analysis = await getAIAnalysis(
            userProfile,
            latestQuiz.courseRankings,
            catalog
          );
          setAiAnalysis(analysis);
        } catch (error) {
          console.error('Failed to fetch AI analysis:', error);
          setAiAnalysis('Could not load guidance at this time.');
        } finally {
          setIsAiLoading(false);
        }
      } else {
        setIsAiLoading(false);
      }
    };
    fetchAnalysis();
  }, [userProfile, latestQuiz, catalog]);

  const handleCoursePress = (courseId: string) => {
    setSelectedCourseId(courseId);
    navigation.navigate('CourseDetail', { courseId });
  };

  const handleEnroll = () => {
    const topId = recommendations[0]?.courses[0]?.id;
    if (topId) handleCoursePress(topId);
  };

  if (!recommendations.length) {
    return (
      <ScreenWrapper gradient>
        <View style={styles.emptyState}>
          <AnimatedFadeIn from="fade">
            <EmptyStateSprite variant="recommendations" />
          </AnimatedFadeIn>
          <Text style={styles.emptyTitle}>No recommendations yet</Text>
          <Text style={styles.emptyText}>
            Complete your profile and assessment to see your top 3 program matches.
          </Text>
          <PressableScale
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('AssessmentQuiz')}
            pressedScale={0.97}
          >
            <Text style={styles.primaryBtnText}>Take Assessment</Text>
          </PressableScale>
        </View>
      </ScreenWrapper>
    );
  }

  const topMatch = recommendations[0];

  return (
    <ScreenWrapper gradient>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedFadeIn index={0}>
          <View style={styles.header}>
            <View style={styles.trophyBadge}>
              <Trophy size={18} color={colors.highlight} />
              <Text style={styles.trophyText}>Results ready</Text>
            </View>
            <Text style={styles.title}>Your top 3 matches</Text>
            <Text style={styles.subtitle}>
              Ranked from your profile answers and assessment results
            </Text>
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={1}>
          <View style={[styles.aiCard, shadows.sm]}>
            <View style={styles.aiHeaderRow}>
              <View style={styles.aiIcon}>
                <Sparkles size={18} color={colors.highlight} />
              </View>
              <Text style={styles.aiTitle}>Guidance summary</Text>
            </View>
            {isAiLoading ? (
              <LoadingSpinner message="Analyzing your profile..." />
            ) : (
              <Text style={styles.aiText}>{aiAnalysis}</Text>
            )}
          </View>
        </AnimatedFadeIn>

        {recommendations.map((rec, index) => (
          <AnimatedFadeIn key={rec.id} index={index + 2}>
            <RecommendationItem
              recommendation={rec}
              rank={index + 1}
              onPress={() => {
                if (rec.courses[0]) handleCoursePress(rec.courses[0].id);
              }}
            />
          </AnimatedFadeIn>
        ))}

        <AnimatedFadeIn index={6}>
          <Text style={styles.sectionTitle}>Browse all programs</Text>
          <Text style={styles.sectionSubtitle}>
            Compare curriculum, careers, and skills
          </Text>

          {catalog.map((course) => {
            const isTop = topMatch?.courses[0]?.id === course.id;
            return (
              <PressableScale
                key={course.id}
                style={[
                  styles.courseCard,
                  shadows.sm,
                  isTop && styles.courseCardTop,
                ]}
                onPress={() => handleCoursePress(course.id)}
                pressedScale={0.985}
              >
                <View style={styles.courseCardHeader}>
                  <View style={styles.courseInfo}>
                    {isTop ? (
                      <Text style={styles.topTag}>Your #1 match</Text>
                    ) : null}
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseDuration}>{course.duration}</Text>
                  </View>
                  <ChevronRight size={22} color={colors.highlight} />
                </View>
                <Text style={styles.courseDescription} numberOfLines={2}>
                  {course.description}
                </Text>
                <View style={styles.courseStats}>
                  <View style={styles.statPill}>
                    <Text style={styles.statPillText}>
                      {course.careerPaths.length} careers
                    </Text>
                  </View>
                  <View style={styles.statPill}>
                    <Text style={styles.statPillText}>
                      {course.skills.length} skills
                    </Text>
                  </View>
                </View>
              </PressableScale>
            );
          })}
        </AnimatedFadeIn>

        <AnimatedFadeIn index={7}>
          <View style={styles.ctaSection}>
            <PressableScale
              style={styles.primaryBtn}
              onPress={handleEnroll}
              pressedScale={0.97}
            >
              <Text style={styles.primaryBtnText}>View top match details</Text>
            </PressableScale>
            <PressableScale
              style={styles.outlineBtn}
              onPress={() => navigation.navigate('Dashboard')}
              pressedScale={0.97}
            >
              <LayoutDashboard size={18} color={colors.highlight} />
              <Text style={styles.outlineBtnText}>Go to Dashboard</Text>
            </PressableScale>
          </View>
        </AnimatedFadeIn>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  header: {
    marginBottom: spacing.xl,
  },
  trophyBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.highlightSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  trophyText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  aiCard: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.45)',
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlightSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  aiText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  courseCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(149, 189, 215, 0.4)',
  },
  courseCardTop: {
    borderColor: colors.highlight,
    backgroundColor: colors.highlightSoft,
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  courseInfo: { flex: 1, marginRight: spacing.md },
  topTag: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 2,
  },
  courseDuration: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  courseDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  courseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statPill: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.45)',
  },
  statPillText: {
    fontSize: typography.sizes.xs,
    color: colors.highlight,
    fontWeight: typography.weights.semibold,
  },
  ctaSection: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.highlight,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.highlight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.highlight,
  },
  outlineBtnText: {
    color: colors.highlight,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
});

export default RecommendationsScreen;
