import React, { useMemo, useRef, useState } from 'react';
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
  ChevronRight,
  BookOpen,
  Star,
  Check,
  Calendar,
  Flag,
} from 'lucide-react-native';
import { useAuthStore } from '../stores/authStore';
import { performSignOut } from '../services/authService';
import { confirmAction } from '../utils/confirm';
import { useCourseStore } from '../stores/courseStore';
import { AnimatedProgressFill } from '../components/AnimatedProgressFill';
import { PressableScale } from '../components/PressableScale';
import { EmptyStateSprite } from '../components/sprites';

const RING_SIZE = 112;
const RING_STROKE = 9;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
/** Open bottom gauge (~270° of a full circle). */
const GAUGE_FRACTION = 0.75;
const GAUGE_LENGTH = RING_CIRCUMFERENCE * GAUGE_FRACTION;

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const userProfile = useUserStore((state) => state.userProfile);
  const quizHistory = useUserStore((state) => state.quizHistory);
  const currentRecommendations = useUserStore(
    (state) => state.currentRecommendations
  );
  const logout = useAuthStore((state) => state.logout);
  const resetUserSession = useUserStore((state) => state.resetUserSession);
  const catalog = useCourseStore((state) => state.getCatalog());
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const heroOffsetY = useRef(0);

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
  const topMatch = Math.max(
    0,
    Math.min(100, topRecommendation?.matchPercent || 0)
  );
  const ringOffset = GAUGE_LENGTH * (1 - topMatch / 100);

  const rankingData = (latestResult?.courseRankings || [])
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((ranking) => ({
      ...ranking,
      course: catalog.find((course) => course.id === ranking.courseId),
    }));

  const strand =
    userProfile?.seniorHighStrand || userProfile?.shsStrand || 'Strand not set';
  const goalsCount = Array.isArray(userProfile?.learningGoals)
    ? userProfile.learningGoals.length
    : userProfile?.learningGoals
      ? 1
      : 0;
  const interestsCount = userProfile?.careerInterests?.length || 0;
  const profileFacts = [
    strand,
    `${goalsCount} ${goalsCount === 1 ? 'goal' : 'goals'}`,
    `${interestsCount} ${interestsCount === 1 ? 'interest' : 'interests'}`,
  ].join(' · ');
  const difficultyLabel = topCourse
    ? `${String(topCourse.difficulty).charAt(0).toUpperCase()}${String(
        topCourse.difficulty
      ).slice(1)} level`
    : null;

  const scrollToHero = () => {
    scrollRef.current?.scrollTo({
      y: Math.max(0, heroOffsetY.current - 8),
      animated: true,
    });
  };

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
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedFadeIn index={0}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>
                {userProfile?.name
                  ? `Hello, ${userProfile.name.split(' ')[0]}`
                  : 'Hello, Student'}
              </Text>
              <Text style={styles.headerSubtitle}>
                Here's where you stand on the path to a program.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              accessibilityLabel="Sign out"
            >
              <LogOut size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={1}>
          <View style={styles.profilePill}>
            <Star size={13} color={colors.highlight} fill={colors.highlight} />
            <Text style={styles.profileFacts} numberOfLines={1}>
              {profileFacts}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
            >
              <Text style={styles.profileLink}>Edit</Text>
            </TouchableOpacity>
          </View>
        </AnimatedFadeIn>

        {/* Summary hero card — gauge + assessments */}
        <AnimatedFadeIn index={2}>
          <View style={[styles.statusCard, shadows.sm]}>
            <View style={styles.statusMatch}>
              <View style={styles.ringWrap}>
                <Svg width={RING_SIZE} height={RING_SIZE}>
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    stroke={colors.highlightSoft}
                    strokeWidth={RING_STROKE}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${GAUGE_LENGTH} ${RING_CIRCUMFERENCE}`}
                    rotation="135"
                    origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
                  />
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    stroke={colors.highlight}
                    strokeWidth={RING_STROKE}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${GAUGE_LENGTH} ${RING_CIRCUMFERENCE}`}
                    strokeDashoffset={ringOffset}
                    rotation="135"
                    origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
                  />
                </Svg>
                <View style={styles.ringLabel}>
                  <Text style={styles.ringValue}>{topMatch}%</Text>
                  <Text style={styles.ringCaption}>Closest match</Text>
                </View>
              </View>
              {topCourse ? (
                <TouchableOpacity
                  style={styles.seeBelowLink}
                  onPress={scrollToHero}
                  activeOpacity={0.7}
                >
                  <Text style={styles.seeBelowText}>See it below</Text>
                  <ChevronRight size={14} color={colors.highlight} />
                </TouchableOpacity>
              ) : (
                <Text style={styles.seeBelowMuted}>Take the assessment</Text>
              )}
            </View>

            <View style={styles.statusDivider} />

            <View style={styles.statusAssessment}>
              <View style={styles.clipboardWrap}>
                <ClipboardList size={36} color={colors.text} strokeWidth={1.75} />
                <View style={styles.clipboardBadge}>
                  <Check size={11} color={colors.surfaceElevated} strokeWidth={3} />
                </View>
              </View>
              <Text style={styles.completedCopy}>
                {quizHistory.length} completed so far
              </Text>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => navigation.navigate('AssessmentQuiz')}
                activeOpacity={0.85}
              >
                <Text style={styles.retakeButtonText}>
                  {quizHistory.length > 0 ? 'Retake' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedFadeIn>

        {/* Hero — gold wash + left bar */}
        <AnimatedFadeIn
          index={3}
          onLayout={(event) => {
            heroOffsetY.current = event.nativeEvent.layout.y;
          }}
        >
          <View style={[styles.heroCard, shadows.sm]}>
            <View style={styles.heroAccent} />
            <View style={styles.heroBody}>
              <View style={styles.heroHeader}>
                <ClipboardList size={15} color={colors.highlight} />
                <Text style={styles.heroLabel}>Recommended next step</Text>
              </View>
              <Text style={styles.heroName} numberOfLines={2}>
                {topCourse?.title || 'Complete your assessment'}
              </Text>

              {topCourse ? (
                <>
                  <Text style={styles.heroDescription} numberOfLines={3}>
                    {topCourse.description}
                  </Text>

                  <View style={styles.heroFacts}>
                    <View style={styles.heroFact}>
                      <Calendar size={13} color={colors.textSecondary} />
                      <Text style={styles.heroFactText}>
                        {topCourse.duration}
                      </Text>
                    </View>
                    {difficultyLabel ? (
                      <>
                        <Text style={styles.heroFactDot}>·</Text>
                        <View style={styles.heroFact}>
                          <Flag size={13} color={colors.textSecondary} />
                          <Text style={styles.heroFactText}>
                            {difficultyLabel}
                          </Text>
                        </View>
                      </>
                    ) : null}
                    {topCourse.estimatedTuitionPerTerm ? (
                      <>
                        <Text style={styles.heroFactDot}>·</Text>
                        <View style={styles.heroFact}>
                          <Text style={styles.heroPeso}>₱</Text>
                          <Text style={styles.heroFactText}>
                            {`${topCourse.estimatedTuitionPerTerm.replace(
                              /^₱\s*/,
                              ''
                            )}/term`}
                          </Text>
                        </View>
                      </>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    style={styles.navyButton}
                    onPress={() =>
                      navigation.navigate('CourseDetail', {
                        courseId: topCourse.id,
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={styles.navyButtonText}>
                      View program details
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.navyButton}
                  onPress={() => navigation.navigate('AssessmentQuiz')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.navyButtonText}>Take assessment</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={4}>
          <View style={[styles.chartCard, shadows.sm]}>
            <View style={styles.chartHeader}>
              <Text style={styles.cardTitle}>Your top matches</Text>
              <Text style={styles.cardHint}>From your latest assessment</Text>
            </View>

            {rankingData.length > 0 ? (
              rankingData.map((item, index) => (
                <View
                  key={item.courseId}
                  style={[
                    styles.barItem,
                    index === rankingData.length - 1 && styles.barItemLast,
                  ]}
                >
                  <View style={styles.barMeta}>
                    <Text style={styles.barLabel} numberOfLines={1}>
                      {item.course?.title || item.courseId}
                    </Text>
                    <Text
                      style={[
                        styles.barValue,
                        index === 0 && styles.barValueTop,
                      ]}
                    >
                      {item.matchPercent}%
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <AnimatedProgressFill
                      value={Math.max(4, item.matchPercent)}
                      delay={index * 110}
                      color={index === 0 ? colors.highlight : colors.accent}
                      style={styles.barFill}
                    />
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.chartEmpty}>
                <EmptyStateSprite size={88} variant="assessment" />
                <Text style={styles.chartEmptyText}>
                  Complete the assessment to see how your top programs compare.
                </Text>
              </View>
            )}
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={5}>
          <PressableScale
            style={[styles.catalogToggle, shadows.sm]}
            onPress={() => setShowAllPrograms((visible) => !visible)}
            pressedScale={0.985}
          >
            <View style={styles.catalogToggleIcon}>
              <BookOpen size={16} color={colors.text} />
            </View>
            <View style={styles.catalogToggleText}>
              <Text style={styles.catalogTitle}>Browse every program</Text>
              <Text style={styles.catalogSubtitle}>
                {catalog.length} undergraduate programs on WisePath
              </Text>
            </View>
            {showAllPrograms ? (
              <ChevronUp size={18} color={colors.textSecondary} />
            ) : (
              <ChevronDown size={18} color={colors.textSecondary} />
            )}
          </PressableScale>

          {showAllPrograms ? (
            <AnimatedFadeIn from="fade" style={[styles.catalogList, shadows.sm]}>
              {catalog.map((course, index) => (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.catalogItem,
                    index === catalog.length - 1 && styles.catalogItemLast,
                  ]}
                  onPress={() =>
                    navigation.navigate('CourseDetail', { courseId: course.id })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.catalogNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <View style={styles.catalogItemContent}>
                    <Text style={styles.catalogItemTitle}>{course.title}</Text>
                    <Text style={styles.catalogItemSubtitle} numberOfLines={1}>
                      {course.careerPaths.slice(0, 2).join(', ')}
                    </Text>
                    <Text style={styles.catalogItemMeta}>
                      {course.duration}
                      {course.estimatedTuitionPerTerm
                        ? ` · ${course.estimatedTuitionPerTerm}/term`
                        : ' · Tuition unavailable'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </AnimatedFadeIn>
          ) : null}
        </AnimatedFadeIn>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
    gap: spacing.lg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
    paddingRight: spacing.md,
  },
  greeting: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.errorSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.highlightSoft,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },
  profileFacts: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: 18,
    minWidth: 0,
  },
  profileLink: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  statusMatch: {
    flex: 1,
    alignItems: 'center',
    paddingRight: spacing.md,
    minWidth: 0,
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  ringValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  ringCaption: {
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginTop: 1,
  },
  seeBelowLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 2,
  },
  seeBelowText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },
  seeBelowMuted: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  statusDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
    alignSelf: 'stretch',
  },
  statusAssessment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: spacing.md,
    gap: spacing.sm,
    minWidth: 0,
  },
  clipboardWrap: {
    position: 'relative',
    marginBottom: spacing.xs,
  },
  clipboardBadge: {
    position: 'absolute',
    right: -6,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surfaceElevated,
  },
  completedCopy: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  retakeButton: {
    alignSelf: 'stretch',
    backgroundColor: colors.text,
    borderRadius: borderRadius.lg,
    minHeight: 44,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  retakeButtonText: {
    color: colors.surfaceElevated,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },

  heroCard: {
    flexDirection: 'row',
    backgroundColor: colors.highlightSoft,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  heroAccent: {
    width: 5,
    backgroundColor: colors.highlight,
  },
  heroBody: {
    flex: 1,
    padding: spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  heroLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.highlight,
  },
  heroName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  heroFacts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: 6,
  },
  heroFact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroFactDot: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginHorizontal: 2,
  },
  heroFactText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  heroPeso: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  navyButton: {
    backgroundColor: colors.text,
    borderRadius: borderRadius.lg,
    minHeight: 48,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navyButtonText: {
    color: colors.surfaceElevated,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },

  chartCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  chartHeader: {
    marginBottom: spacing.lg,
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
  barItem: {
    marginBottom: spacing.md,
  },
  barItemLast: {
    marginBottom: 0,
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
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  barValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  barValueTop: {
    color: colors.highlight,
  },
  barTrack: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
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
    marginTop: spacing.sm,
  },

  catalogToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  catalogToggleIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catalogToggleText: {
    flex: 1,
  },
  catalogTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  catalogSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  catalogList: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  catalogItemLast: {
    borderBottomWidth: 0,
  },
  catalogNumber: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.accent,
    marginTop: 2,
    width: 20,
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
  catalogItemMeta: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.accent,
    marginTop: 3,
  },
});

export default DashboardScreen;
