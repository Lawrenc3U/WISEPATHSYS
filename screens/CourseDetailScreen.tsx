import React, { useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { useCourseStore } from '../stores/courseStore';
import { useUserStore } from '../stores/userStore';
import { CourseDetailScreenProps } from '../navigation/types';
import { CheckCircle, Clock, Award, TrendingUp } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { SAMPLE_COURSES } from '../utils/constants';
import { PrimaryButton } from '../components/PrimaryButton';

const CourseDetailScreen = ({
  route,
  navigation,
}: CourseDetailScreenProps) => {
  const { courseId } = route.params;
  const getCourseById = useCourseStore((state) => state.getCourseById);
  const userProfile = useUserStore((state) => state.userProfile);

  const course = useMemo(
    () =>
      getCourseById(courseId) ||
      SAMPLE_COURSES.find((item) => item.id === courseId),
    [courseId, getCourseById]
  );

  if (!course) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Course not found</Text>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.outlineBtnText}>Go Back</Text>
          </TouchableOpacity>
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
            colors={[colors.highlight, '#5B97B8']}
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
              {course.estimatedTuitionPerTerm ? (
                <Text style={styles.heroStatText}>
                  {course.estimatedTuitionPerTerm}/term
                </Text>
              ) : null}
            </View>
          </LinearGradient>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={1}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills you'll learn</Text>
            {course.skills.map((skill, index) => (
              <View key={skill} style={styles.skillRow}>
                <CheckCircle size={18} color={colors.highlight} />
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={2}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Curriculum Checklist</Text>
            {course.curriculum.map((item, index) => {
              const isCompleted = userProfile?.progress?.courseId === courseId && userProfile?.progress?.completedSubjects?.includes(item);
              return (
                <View key={item} style={styles.curriculumRow}>
                  <View style={[styles.curriculumIcon, isCompleted && { backgroundColor: colors.success }]}>
                    {isCompleted ? (
                      <CheckCircle size={16} color="#FFF" />
                    ) : (
                      <Text style={styles.curriculumNumText}>{index + 1}</Text>
                    )}
                  </View>
                  <Text style={[styles.curriculumText, isCompleted && { textDecorationLine: 'line-through', color: colors.textSecondary }]}>{item}</Text>
                </View>
              );
            })}
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={3}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color={colors.highlight} />
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Career paths</Text>
            </View>
            {course.careerPaths.map((path) => (
              <View key={path} style={styles.careerChip}>
                <Text style={styles.careerText}>{path}</Text>
              </View>
            ))}
          </View>
        </AnimatedFadeIn>

      </ScrollView>

      <AnimatedFadeIn index={4} style={styles.footer}>
        <PrimaryButton
          label="Back to Recommendations"
          onPress={() => navigation.navigate('Recommendations')}
          variant="outline"
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
    ...shadows.md,
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
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  heroStats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heroStatText: { color: '#FFF', fontWeight: typography.weights.semibold },
  section: {
    ...shadows.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.4)',
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
    borderBottomColor: 'rgba(149, 189, 215, 0.35)',
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
  curriculumIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.highlight,
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
    backgroundColor: colors.highlightSoft,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.highlight,
  },
  careerText: { fontSize: typography.sizes.sm, color: colors.text },
  assessmentHint: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  assessmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  assessmentRowContent: { flex: 1, marginRight: spacing.md },
  assessmentTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  assessmentStatus: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.9)',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(149, 189, 215, 0.35)',
    backgroundColor: 'rgba(255,255,255,0.7)',
    gap: spacing.sm,
  },
  outlineBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.highlight,
    backgroundColor: colors.surfaceElevated,
    marginTop: spacing.sm,
  },
  outlineBtnText: {
    color: colors.highlight,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
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
