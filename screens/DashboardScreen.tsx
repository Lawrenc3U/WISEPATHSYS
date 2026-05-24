import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { PrimaryButton } from '../components/PrimaryButton';
import { DashboardScreenProps } from '../navigation/types';
import { useUserStore } from '../stores/userStore';
import { useCourseStore } from '../stores/courseStore';
import { ChevronRight, BarChart3, BookOpen, User, LogOut } from 'lucide-react-native';
import { useAuthStore } from '../stores/authStore';
import { logoutUser } from '../services/authService';
import { loadCourseProgress } from '../services/progressService';

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const userProfile = useUserStore((state) => state.userProfile);
  const selectedCourseId = useUserStore((state) => state.selectedCourseId);
  const setSelectedCourseId = useUserStore((state) => state.setSelectedCourseId);
  const logout = useAuthStore((state) => state.logout);
  const account = useAuthStore((state) => state.account);
  const resetUserSession = useUserStore((state) => state.resetUserSession);
  const setStudentProgress = useUserStore((state) => state.setStudentProgress);
  const setCourseProgress = useUserStore((state) => state.setCourseProgress);
  const progressByCourse = useUserStore((state) => state.progressByCourse);
  const studentProgress = useUserStore((state) => state.studentProgress);
  const allCourses = useCourseStore((state) => state.allCourses);

  const selectedCourse =
    allCourses.find((c) => c.id === (selectedCourseId || 'it')) ||
    allCourses[0];

  const handleStartQuiz = () => {
    navigation.navigate('AssessmentQuiz');
  };

  const handleViewProgress = () => {
    if (selectedCourse) {
      navigation.navigate('Progress', { courseId: selectedCourse.id });
    }
  };

  const handleSelectCourse = async (courseId: string) => {
    setSelectedCourseId(courseId);

    const cached = progressByCourse[courseId];
    if (cached) {
      setStudentProgress(cached);
      return;
    }

    if (account?.uid) {
      const progress = await loadCourseProgress(account.uid, courseId);
      if (progress) {
        setCourseProgress(courseId, progress);
        setStudentProgress(progress);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logoutUser();
          logout();
          resetUserSession();
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <ScreenWrapper gradient>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedFadeIn index={0}>
        <LinearGradient
          colors={[colors.gradientStart, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <Text style={styles.headerSubtitle}>
                {userProfile?.name ? `Welcome back, ${userProfile.name}!` : 'Welcome to WisePath'}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('Profile')}
              >
                <User size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
                <LogOut size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </LinearGradient>
        </AnimatedFadeIn>

        {/* Quick Stats */}
        {userProfile && (
          <View style={styles.statsSection}>
            <StatCard
              label="Learning Goals"
              value={userProfile.learningGoals || 'Not set'}
              icon={<BookOpen size={24} color={colors.primary} strokeWidth={1.5} />}
            />
            <StatCard
              label="Skill Level"
              value={userProfile.currentSkills || 'Beginner'}
              icon={<BarChart3 size={24} color={colors.secondary} strokeWidth={1.5} />}
            />
          </View>
        )}

        {/* Selected Course Section */}
        <View style={styles.courseSection}>
          <Text style={styles.sectionTitle}>Your Program</Text>

          {selectedCourse && (
            <View style={styles.courseCard}>
              <View style={styles.courseCardHeader}>
                <Text style={styles.courseName}>{selectedCourse.title}</Text>
              </View>

              <Text style={styles.courseDescription}>
                {selectedCourse.description}
              </Text>

              <View style={styles.courseMetrics}>
                <MetricBadge label="Duration" value={selectedCourse.duration} />
                <MetricBadge
                  label="Progress"
                  value={
                    studentProgress
                      ? `${studentProgress.progressPercentage}%`
                      : 'Not started'
                  }
                />
              </View>

              <TouchableOpacity
                style={styles.viewProgressButton}
                onPress={handleViewProgress}
              >
                <Text style={styles.viewProgressButtonText}>View Progress</Text>
                <ChevronRight size={20} color={colors.primary} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Course Selection */}
        <View style={styles.courseSelectionSection}>
          <Text style={styles.sectionTitle}>All Programs</Text>

          {allCourses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={[
                styles.courseOption,
                selectedCourseId === course.id && styles.courseOptionSelected,
              ]}
              onPress={() => handleSelectCourse(course.id)}
            >
              <View style={styles.courseOptionContent}>
                <Text
                  style={[
                    styles.courseOptionTitle,
                    selectedCourseId === course.id &&
                      styles.courseOptionTitleSelected,
                  ]}
                >
                  {course.title}
                </Text>
                <View style={styles.careersPreview}>
                  {course.careerPaths.slice(0, 2).map((path, idx) => (
                    <Text key={idx} style={styles.careerPathSmall}>
                      {path}
                      {idx < 1 ? ', ' : ''}
                    </Text>
                  ))}
                </View>
              </View>
              <ChevronRight
                size={20}
                color={selectedCourseId === course.id ? colors.primary : colors.border}
                strokeWidth={2}
              />
            </TouchableOpacity>
          ))}
        </View>

        <AnimatedFadeIn index={4}>
        <View style={styles.actionSection}>
          <PrimaryButton label="Take Assessment Quiz" onPress={handleStartQuiz} />
          <PrimaryButton
            label="View Course Details"
            onPress={() => navigation.navigate('CourseDetail', { courseId: selectedCourse?.id || 'it' })}
            variant="outline"
            style={{ marginTop: spacing.md }}
          />
          {userProfile?.selectedPath && (
            <PrimaryButton
              label="View Recommendations"
              onPress={() => navigation.navigate('Recommendations')}
              variant="outline"
              style={{ marginTop: spacing.md }}
            />
          )}
        </View>
        </AnimatedFadeIn>
      </ScrollView>
    </ScreenWrapper>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>{icon}</View>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

interface MetricBadgeProps {
  label: string;
  value: string;
}

const MetricBadge: React.FC<MetricBadgeProps> = ({ label, value }) => (
  <View style={styles.metricBadge}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  headerGradient: {
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: { flex: 1 },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: {
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.full,
  },
  headerTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.sizes.base,
    color: 'rgba(255,255,255,0.9)',
  },
  statsSection: {
    marginBottom: spacing.xl,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  statIconContainer: {
    marginRight: spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.text,
  },
  courseSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  courseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  courseName: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },
  courseDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  courseMetrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  metricBadge: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: typography.sizes.base,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewProgressButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewProgressButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: spacing.sm,
  },
  courseSelectionSection: {
    marginBottom: spacing.xl,
  },
  courseOption: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  courseOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0E7FF',
  },
  courseOptionContent: {
    flex: 1,
  },
  courseOptionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  courseOptionTitleSelected: {
    color: colors.primary,
  },
  careersPreview: {
    flexDirection: 'row',
  },
  careerPathSmall: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  actionSection: {
    marginBottom: spacing.lg,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  actionButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    fontSize: typography.sizes.base,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default DashboardScreen;
