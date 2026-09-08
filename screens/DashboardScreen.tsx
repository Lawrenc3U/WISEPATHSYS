import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { DashboardScreenProps } from '../navigation/types';
import { useUserStore } from '../stores/userStore';
import {
  LogOut,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  BookOpen,
  GraduationCap,
  Target,
  Sparkles,
} from 'lucide-react-native';
import { useAuthStore } from '../stores/authStore';
import { performSignOut } from '../services/authService';
import { confirmAction } from '../utils/confirm';
import { SAMPLE_COURSES } from '../utils/constants';

const RING_SIZE = 104;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const userProfile = useUserStore((state) => state.userProfile);
  const quizHistory = useUserStore((state) => state.quizHistory);
  const currentRecommendations = useUserStore(
    (state) => state.currentRecommendations
  );
  const logout = useAuthStore((state) => state.logout);
  const resetUserSession = useUserStore((state) => state.resetUserSession);
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  const latestResult = useMemo(
    () =>
      [...quizHistory].sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )[0],
    [quizHistory]
  );

  const recommendations =
    currentRecommendations.length > 0
      ? currentRecommendations
      : latestResult?.recommendedPaths || [];
  const topRecommendation =
    recommendations[0] || userProfile?.selectedPath || null;
  const topCourse = topRecommendation?.courses[0] || null;
  const topMatch = Math.max(0, Math.min(100, topRecommendation?.matchPercent || 0));
  const ringOffset = RING_CIRCUMFERENCE * (1 - topMatch / 100);

  const rankingData = (latestResult?.courseRankings || [])
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((ranking) => ({
      ...ranking,
      course: SAMPLE_COURSES.find((course) => course.id === ranking.courseId),
    }));

  const strand =
    userProfile?.seniorHighStrand || userProfile?.shsStrand || 'Not set';
  const goalsCount = Array.isArray(userProfile?.learningGoals)
    ? userProfile.learningGoals.length
    : userProfile?.learningGoals
      ? 1
      : 0;
  const interestsCount = userProfile?.careerInterests?.length || 0;

  const handleLogout = () => {
    confirmAction(
      'Sign out',
      'Are you sure you want to sign out?',
      'Sign out',
      () => performSignOut(logout, resetUserSession),
      { destructive: true }
    );
  };

  return (
    <ScreenWrapper gradient>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedFadeIn index={0}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.eyebrow}>WISEPATH DASHBOARD</Text>
              <Text style={styles.greeting}>
                {userProfile?.name
                  ? `Hello, ${userProfile.name.split(' ')[0]}`
                  : 'Hello, Student'}
              </Text>
              <Text style={styles.headerSubtitle}>
                Here is your academic guidance summary.
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.iconButton, styles.logoutIconButton]}
                onPress={handleLogout}
                accessibilityLabel="Sign out"
              >
                <LogOut size={19} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={1}>
          <View style={[styles.summaryCard, shadows.sm]}>
            <View style={styles.summaryHeader}>
              <Text style={styles.cardTitle}>Profile summary</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.linkText}>View profile</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.summaryRow}>
              <SummaryItem
                icon={<GraduationCap size={18} color={colors.highlight} />}
                label="SHS strand"
                value={strand}
              />
              <SummaryItem
                icon={<Target size={18} color={colors.highlight} />}
                label="Goals"
                value={`${goalsCount}`}
              />
              <SummaryItem
                icon={<Sparkles size={18} color={colors.highlight} />}
                label="Interests"
                value={`${interestsCount}`}
              />
            </View>
          </View>
        </AnimatedFadeIn>

        <View style={styles.metricsRow}>
          <AnimatedFadeIn index={2} style={styles.metricColumn}>
            <View style={[styles.matchCard, shadows.sm]}>
              <View>
                <Text style={styles.cardTitle}>Top match</Text>
                <Text style={styles.cardHint}>Profile + assessment</Text>
              </View>
              <View style={styles.ringWrap}>
                <Svg width={RING_SIZE} height={RING_SIZE}>
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    stroke={colors.highlightSoft}
                    strokeWidth={RING_STROKE}
                    fill="none"
                  />
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    stroke={colors.highlight}
                    strokeWidth={RING_STROKE}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
                    strokeDashoffset={ringOffset}
                    rotation="-90"
                    origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
                  />
                </Svg>
                <View style={styles.ringLabel}>
                  <Text style={styles.ringValue}>{topMatch}%</Text>
                  <Text style={styles.ringCaption}>fit</Text>
                </View>
              </View>
              <Text style={styles.matchName} numberOfLines={2}>
                {topCourse?.title || 'Take the assessment'}
              </Text>
            </View>
          </AnimatedFadeIn>

          <AnimatedFadeIn index={3} style={styles.metricColumn}>
            <View style={[styles.assessmentCard, shadows.sm]}>
              <View style={styles.assessmentIcon}>
                <ClipboardList size={22} color={colors.highlight} />
              </View>
              <Text style={styles.assessmentValue}>{quizHistory.length}</Text>
              <Text style={styles.assessmentLabel}>
                {quizHistory.length === 1 ? 'Assessment' : 'Assessments'}
              </Text>
              <Text style={styles.assessmentHint}>
                {quizHistory.length > 0 ? 'completed' : 'not taken yet'}
              </Text>
              <TouchableOpacity
                style={styles.assessmentButton}
                onPress={() => navigation.navigate('AssessmentQuiz')}
                activeOpacity={0.85}
              >
                <Text style={styles.assessmentButtonText}>
                  {quizHistory.length > 0 ? 'Retake' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>
          </AnimatedFadeIn>
        </View>

        <AnimatedFadeIn index={4}>
          <View style={[styles.programCard, shadows.sm]}>
            <View style={styles.programHeader}>
              <View style={styles.programIcon}>
                <BookOpen size={20} color={colors.highlight} />
              </View>
              <View style={styles.programHeading}>
                <Text style={styles.cardHint}>RECOMMENDED PROGRAM</Text>
                <Text style={styles.programName} numberOfLines={2}>
                  {topCourse?.title || 'Complete your assessment'}
                </Text>
              </View>
            </View>
            {topCourse ? (
              <>
                <Text style={styles.programDescription} numberOfLines={3}>
                  {topCourse.description}
                </Text>
                <View style={styles.programMeta}>
                  <View style={styles.metaPill}>
                    <Text style={styles.metaText}>{topCourse.duration}</Text>
                  </View>
                  <View style={styles.metaPill}>
                    <Text style={styles.metaText}>
                      {topCourse.difficulty} level
                    </Text>
                  </View>
                  {topCourse.estimatedTuitionPerTerm ? (
                    <View style={styles.metaPill}>
                      <Text style={styles.metaText}>
                        {topCourse.estimatedTuitionPerTerm}/term
                      </Text>
                    </View>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() =>
                    navigation.navigate('CourseDetail', {
                      courseId: topCourse.id,
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>View program details</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('AssessmentQuiz')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Take assessment</Text>
              </TouchableOpacity>
            )}
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={5}>
          <TouchableOpacity
            style={[styles.catalogButton, shadows.sm]}
            onPress={() => setShowAllPrograms((visible) => !visible)}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.catalogTitle}>Available programs</Text>
              <Text style={styles.catalogSubtitle}>
                {SAMPLE_COURSES.length} undergraduate programs
              </Text>
            </View>
            <View style={styles.catalogIcon}>
              {showAllPrograms ? (
                <ChevronUp size={20} color={colors.highlight} />
              ) : (
                <ChevronDown size={20} color={colors.highlight} />
              )}
            </View>
          </TouchableOpacity>

          {showAllPrograms ? (
            <View style={styles.catalogList}>
              {SAMPLE_COURSES.map((course, index) => (
                <View key={course.id} style={[styles.catalogItem, shadows.sm]}>
                  <View style={styles.catalogNumber}>
                    <Text style={styles.catalogNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.catalogItemContent}>
                    <Text style={styles.catalogItemTitle}>{course.title}</Text>
                    <Text style={styles.catalogItemSubtitle} numberOfLines={1}>
                      {course.careerPaths.slice(0, 2).join(' · ')}
                    </Text>
                    <Text style={styles.catalogItemCost}>
                      {course.duration}
                      {course.estimatedTuitionPerTerm
                        ? ` · ${course.estimatedTuitionPerTerm}/term`
                        : ' · Tuition unavailable'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </AnimatedFadeIn>

        <AnimatedFadeIn index={6}>
          <View style={[styles.chartCard, shadows.sm]}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.cardTitle}>Program fit overview</Text>
                <Text style={styles.cardHint}>Your latest top matches</Text>
              </View>
              <View style={styles.chartBadge}>
                <Text style={styles.chartBadgeText}>TOP 3</Text>
              </View>
            </View>

            {rankingData.length > 0 ? (
              rankingData.map((item, index) => (
                <View key={item.courseId} style={styles.barItem}>
                  <View style={styles.barMeta}>
                    <Text style={styles.barLabel} numberOfLines={1}>
                      {item.course?.title || item.courseId}
                    </Text>
                    <Text style={styles.barValue}>{item.matchPercent}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        index > 0 && styles.barFillSecondary,
                        { width: `${Math.max(4, item.matchPercent)}%` },
                      ]}
                    />
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.chartEmpty}>
                <Text style={styles.chartEmptyText}>
                  Complete the assessment to generate your program-fit chart.
                </Text>
              </View>
            )}
          </View>
        </AnimatedFadeIn>
      </ScrollView>
    </ScreenWrapper>
  );
};

const SummaryItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <View style={styles.summaryItem}>
    <View style={styles.summaryIcon}>{icon}</View>
    <Text style={styles.summaryValue} numberOfLines={1}>
      {value}
    </Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerContent: {
    flex: 1,
    paddingRight: spacing.md,
  },
  eyebrow: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  greeting: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    flexShrink: 0,
    gap: spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIconButton: {
    backgroundColor: '#FEF2F2',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  summaryCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.35)',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  cardHint: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  linkText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(149, 189, 215, 0.25)',
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlightSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  summaryValue: {
    maxWidth: '90%',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  summaryLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metricColumn: {
    flex: 1,
  },
  matchCard: {
    minHeight: 236,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.35)',
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    marginVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  ringCaption: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  matchName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: 16,
    textAlign: 'center',
  },
  assessmentCard: {
    minHeight: 236,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.35)',
  },
  assessmentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.highlightSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  assessmentValue: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  assessmentLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  assessmentHint: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  assessmentButton: {
    backgroundColor: colors.highlight,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  assessmentButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  programCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.35)',
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  programIcon: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.highlightSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  programHeading: {
    flex: 1,
  },
  programName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: 2,
  },
  programDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  programMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metaPill: {
    backgroundColor: colors.highlightSoft,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  metaText: {
    fontSize: typography.sizes.xs,
    color: colors.highlight,
    fontWeight: typography.weights.semibold,
    textTransform: 'capitalize',
  },
  primaryButton: {
    backgroundColor: colors.highlight,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  catalogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.35)',
  },
  catalogTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  catalogSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  catalogIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.highlightSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catalogList: {
    marginBottom: spacing.md,
  },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.3)',
  },
  catalogNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highlightSoft,
  },
  catalogNumberText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },
  catalogItemContent: {
    flex: 1,
  },
  catalogItemTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: 19,
  },
  catalogItemSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 3,
  },
  catalogItemCost: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.highlight,
    marginTop: 3,
  },
  chartCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.35)',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  chartBadge: {
    backgroundColor: colors.highlightSoft,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  chartBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },
  barItem: {
    marginBottom: spacing.md,
  },
  barMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: 6,
  },
  barLabel: {
    flex: 1,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  barValue: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },
  barTrack: {
    height: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.highlightSoft,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.highlight,
  },
  barFillSecondary: {
    backgroundColor: colors.accent,
  },
  chartEmpty: {
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartEmptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default DashboardScreen;
