import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { ProgressScreenProps } from '../navigation/types';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { useCourseStore } from '../stores/courseStore';
import { loadCourseProgress } from '../services/progressService';
import { CheckCircle2, Clock, BookOpen, Zap, Award } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';

const ProgressTrackingScreen: React.FC<ProgressScreenProps> = ({ route }) => {
  const { courseId } = route.params;
  const account = useAuthStore((s) => s.account);
  const setStudentProgress = useUserStore((state) => state.setStudentProgress);
  const setCourseProgress = useUserStore((state) => state.setCourseProgress);
  const progressByCourse = useUserStore((state) => state.progressByCourse);
  const getCourseById = useCourseStore((state) => state.getCourseById);
  const [loading, setLoading] = useState(true);

  const course = getCourseById(courseId) || null;
  const progress = progressByCourse[courseId] ?? null;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (account?.uid) {
          const data = await loadCourseProgress(account.uid, courseId);
          if (data) {
            setCourseProgress(courseId, data);
            setStudentProgress(data);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, account?.uid, setCourseProgress, setStudentProgress]);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!course || !progress) {
    return (
      <ScreenWrapper>
        <Text style={styles.errorText}>
          No progress saved for this program yet. Complete the assessment or tap
          Start Course from course details.
        </Text>
      </ScreenWrapper>
    );
  }

  const totalSubjects =
    progress.completedSubjects.length +
    progress.ongoingSubjects.length +
    progress.remainingSubjects.length;

  const daysRemaining = Math.ceil(
    (progress.expectedGraduationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <ScreenWrapper gradient>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedFadeIn index={0}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{course.title}</Text>
            <Text style={styles.headerSubtitle}>Academic Progress</Text>
            {progress.lastAssessmentAt && (
              <Text style={styles.syncNote}>
                Last updated from assessment:{' '}
                {progress.lastAssessmentAt.toLocaleDateString()}
              </Text>
            )}
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={1}>
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressValue}>{progress.progressPercentage}%</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${Math.min(100, progress.progressPercentage)}%` },
                ]}
              />
            </View>
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={2}>
          <View style={styles.metricsSection}>
            <MetricCard
              icon={<BookOpen size={28} color={colors.primary} />}
              label="Year Level"
              value={`Year ${progress.currentYearLevel}`}
              subtext="4-year program"
            />
            <MetricCard
              icon={<Clock size={28} color={colors.secondary} />}
              label="Semester"
              value={`Semester ${progress.currentSemester}`}
              subtext={`${daysRemaining} days to graduation`}
            />
            <MetricCard
              icon={<CheckCircle2 size={28} color={colors.success} />}
              label="Completed"
              value={`${progress.completedSubjects.length}/${totalSubjects}`}
              subtext="subjects finished"
            />
            <MetricCard
              icon={<Zap size={28} color={colors.warning} />}
              label="Ongoing"
              value={`${progress.ongoingSubjects.length}`}
              subtext="in progress"
            />
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={3}>
          <View
            style={[
              styles.graduationCard,
              {
                borderColor: progress.graduationReady
                  ? colors.success
                  : colors.warning,
              },
            ]}
          >
            <Award
              size={32}
              color={progress.graduationReady ? colors.success : colors.warning}
            />
            <Text style={styles.graduationTitle}>Graduation Readiness</Text>
            <Text
              style={{
                color: progress.graduationReady ? colors.success : colors.warning,
                fontWeight: typography.weights.bold,
              }}
            >
              {progress.graduationReady ? 'Ready to Graduate' : 'Not Yet Ready'}
            </Text>
            <Text style={styles.graduationDate}>
              Expected: {formatDate(progress.expectedGraduationDate)}
            </Text>
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={4}>
          <SubjectBlock
            title="Completed"
            items={progress.completedSubjects}
            icon={<CheckCircle2 size={20} color={colors.success} />}
            empty="No subjects completed yet"
          />
          <SubjectBlock
            title="Ongoing"
            items={progress.ongoingSubjects}
            icon={<Clock size={20} color={colors.warning} />}
            empty="No ongoing subjects"
          />
          <SubjectBlock
            title="Remaining"
            items={progress.remainingSubjects}
            icon={<BookOpen size={20} color={colors.accent} />}
            empty="No remaining subjects"
          />
        </AnimatedFadeIn>
      </ScrollView>
    </ScreenWrapper>
  );
};

const SubjectBlock = ({
  title,
  items,
  icon,
  empty,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  empty: string;
}) => (
  <View style={styles.subjectCategory}>
    <View style={styles.subjectCategoryHeader}>
      {icon}
      <Text style={styles.subjectCategoryTitle}>{title}</Text>
      <Text style={styles.subjectCount}>{items.length}</Text>
    </View>
    {items.length > 0
      ? items.map((subject) => (
          <Text key={subject} style={styles.subjectItem}>
            • {subject}
          </Text>
        ))
      : (
          <Text style={styles.noSubjects}>{empty}</Text>
        )}
  </View>
);

const MetricCard = ({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) => (
  <View style={styles.metricCard}>
    {icon}
    <View style={styles.metricContent}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricSubtext}>{subtext}</Text>
    </View>
  </View>
);

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  loadingText: { color: colors.textSecondary },
  header: { marginBottom: spacing.xl },
  headerTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  headerSubtitle: { fontSize: typography.sizes.base, color: colors.textSecondary },
  syncNote: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  progressLabel: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  progressValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginVertical: spacing.sm,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: colors.primary },
  metricsSection: { marginBottom: spacing.xl },
  metricCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  metricContent: { flex: 1 },
  metricLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  metricValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  metricSubtext: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  graduationCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    gap: spacing.sm,
  },
  graduationTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  graduationDate: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  subjectCategory: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  subjectCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subjectCategoryTitle: {
    flex: 1,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subjectCount: { fontWeight: typography.weights.bold, color: colors.primary },
  subjectItem: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
  noSubjects: { fontStyle: 'italic', color: colors.textSecondary },
  errorText: {
    textAlign: 'center',
    margin: spacing.xl,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

export default ProgressTrackingScreen;
