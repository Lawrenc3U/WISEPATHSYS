import React, { useMemo, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { useCourseStore } from '../stores/courseStore';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { CourseDetailScreenProps } from '../navigation/types';
import { enrollInCourse, getTemplateProgress } from '../services/progressService';
import { Recommendation } from '../utils/types';
import { CheckCircle, Clock, Award, TrendingUp, Rocket } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { PrimaryButton } from '../components/PrimaryButton';

const CourseDetailScreen = ({
  route,
  navigation,
}: CourseDetailScreenProps) => {
  const { courseId } = route.params;
  const getCourseById = useCourseStore((state) => state.getCourseById);
  const setSelectedCourseId = useUserStore((state) => state.setSelectedCourseId);
  const setStudentProgress = useUserStore((state) => state.setStudentProgress);
  const setCourseProgress = useUserStore((state) => state.setCourseProgress);
  const setSelectedPath = useUserStore((state) => state.setSelectedPath);
  const setUserProfile = useUserStore((state) => state.setUserProfile);
  const userProfile = useUserStore((state) => state.userProfile);
  const account = useAuthStore((state) => state.account);
  const [enrolling, setEnrolling] = useState(false);

  const course = useMemo(() => getCourseById(courseId), [courseId, getCourseById]);

  const handleStartCourse = async () => {
    if (!course) return;

    setEnrolling(true);

    let progress;
    if (account?.uid) {
      progress = await enrollInCourse(account.uid, courseId);
    } else {
      progress = getTemplateProgress(courseId);
    }

    if (!progress) {
      setEnrolling(false);
      return;
    }

    const enrollment: Recommendation = {
      id: `enrolled-${course.id}`,
      title: course.title,
      description: course.description,
      estimatedDuration: course.duration,
      difficulty: course.difficulty,
      courses: [course],
      requiredSkills: course.skills,
      careerApplications: course.careerPaths,
    };

    setSelectedCourseId(courseId);
    setCourseProgress(courseId, progress);
    setStudentProgress(progress);
    setSelectedPath(enrollment);

    if (userProfile) {
      setUserProfile({
        ...userProfile,
        selectedPath: enrollment,
        progress,
      });
    }

    setTimeout(() => {
      setEnrolling(false);
      navigation.navigate('Progress', { courseId });
    }, 400);
  };

  if (!course) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Course not found</Text>
          <PrimaryButton
            label="Go Back"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={{ marginTop: spacing.lg }}
          />
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
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <Text style={styles.heroTitle}>{course.title}</Text>
            <Text style={styles.heroDesc}>{course.description}</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Clock size={18} color="#FFF" />
                <Text style={styles.heroStatText}>{course.duration}</Text>
              </View>
              <View style={styles.heroStat}>
                <Award size={18} color="#FFF" />
                <Text style={styles.heroStatText}>{course.skills.length} skills</Text>
              </View>
            </View>
          </LinearGradient>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={1}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills you'll learn</Text>
            {course.skills.map((skill, index) => (
              <View key={skill} style={styles.skillRow}>
                <CheckCircle size={18} color={colors.primary} />
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={2}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Curriculum</Text>
            {course.curriculum.map((item, index) => (
              <View key={item} style={styles.curriculumRow}>
                <View style={styles.curriculumNum}>
                  <Text style={styles.curriculumNumText}>{index + 1}</Text>
                </View>
                <Text style={styles.curriculumText}>{item}</Text>
              </View>
            ))}
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={3}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Career paths</Text>
            </View>
            {course.careerPaths.map((path) => (
              <View key={path} style={styles.careerChip}>
                <Text style={styles.careerText}>{path}</Text>
              </View>
            ))}
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={4}>
          <View style={styles.infoBox}>
            <Rocket size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Starting this course enrolls you in the program and opens your progress
              tracker with subjects, semester plan, and graduation timeline.
            </Text>
          </View>
        </AnimatedFadeIn>
      </ScrollView>

      <AnimatedFadeIn index={5} style={styles.footer}>
        <PrimaryButton
          label={enrolling ? 'Enrolling...' : 'Start Course'}
          onPress={handleStartCourse}
          loading={enrolling}
          icon={<Rocket size={20} color="#FFF" />}
        />
        <PrimaryButton
          label="Back to Recommendations"
          onPress={() => navigation.navigate('Recommendations')}
          variant="outline"
          style={{ marginTop: spacing.sm }}
        />
      </AnimatedFadeIn>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  heroCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  heroDesc: {
    fontSize: typography.sizes.sm,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  heroStats: { flexDirection: 'row', gap: spacing.xl },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heroStatText: { color: '#FFF', fontWeight: typography.weights.semibold },
  section: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  skillText: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.text,
  },
  curriculumRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  curriculumNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  curriculumNumText: { color: '#FFF', fontWeight: typography.weights.bold, fontSize: 12 },
  curriculumText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: 22,
  },
  careerChip: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  careerText: { fontSize: typography.sizes.sm, color: colors.text },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: '#F3EFFF',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: { fontSize: typography.sizes.base, color: colors.textSecondary },
});

export default CourseDetailScreen;
