import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { AdminDashboardScreenProps } from '../navigation/types';
import { useAuthStore } from '../stores/authStore';
import { logoutUser } from '../services/authService';
import { useUserStore } from '../stores/userStore';
import {
  Users,
  ClipboardCheck,
  TrendingUp,
  BookOpen,
  LogOut,
  Shield,
  Activity,
  BookMarked,
  ListChecks,
  Database,
} from 'lucide-react-native';
import {
  loadAdminOverviewStats,
  AdminOverviewStats,
  AdminActivityItem,
} from '../services/adminService';
import { isFirebaseConfigured, getFirebaseProjectId } from '../services/firebase';

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  navigation,
}) => {
  const account = useAuthStore((s) => s.account);
  const logout = useAuthStore((s) => s.logout);
  const resetUserSession = useUserStore((s) => s.resetUserSession);

  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    const data = await loadAdminOverviewStats();
    setStats(data);
  }, []);

  useEffect(() => {
    loadStats().finally(() => setLoading(false));
  }, [loadStats]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
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

  const formatRelativeTime = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const activityIcon = (type: AdminActivityItem['type']) => {
    switch (type) {
      case 'assessment':
        return <ClipboardCheck size={18} color={colors.primary} />;
      case 'enrollment':
        return <TrendingUp size={18} color={colors.success} />;
      default:
        return <Users size={18} color={colors.secondary} />;
    }
  };

  const StatCard = ({
    label,
    value,
    icon,
    accent,
  }: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    accent: string;
  }) => (
    <View style={[styles.statCard, shadows.sm]}>
      <View style={[styles.statIconWrap, { backgroundColor: accent + '18' }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Shield size={36} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Admin Overview</Text>
            <Text style={styles.subtitle}>{account?.email}</Text>
          </View>
        </View>

        {isFirebaseConfigured() && (
          <Text style={styles.firebaseBadge}>
            {getFirebaseProjectId()}
          </Text>
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : (
          <>
            <View style={styles.statsGrid}>
              <StatCard
                label="Total Students"
                value={stats?.totalStudents ?? 0}
                icon={<Users size={22} color={colors.primary} />}
                accent={colors.primary}
              />
              <StatCard
                label="Active Assessments"
                value={stats?.activeAssessments ?? 0}
                icon={<ClipboardCheck size={22} color={colors.secondary} />}
                accent={colors.secondary}
              />
              <StatCard
                label="Completion Rate"
                value={`${stats?.completionRate ?? 0}%`}
                icon={<TrendingUp size={22} color={colors.success} />}
                accent={colors.success}
              />
              <StatCard
                label="Total Courses"
                value={stats?.totalCourses ?? 0}
                icon={<BookOpen size={22} color={colors.accent} />}
                accent={colors.accent}
              />
            </View>

            <Text style={styles.completionHint}>
              Completion rate = students who finished at least one assessment
              {stats?.totalAssessments != null
                ? ` · ${stats.totalAssessments} total assessments`
                : ''}
            </Text>

            <View style={[styles.section, shadows.sm]}>
              <View style={styles.sectionHeader}>
                <Activity size={22} color={colors.primary} />
                <Text style={styles.sectionTitle}>Recent Activity</Text>
              </View>

              {stats?.recentActivity.length === 0 ? (
                <Text style={styles.emptyActivity}>
                  No activity yet. Students will appear here after they register
                  or complete assessments.
                </Text>
              ) : (
                stats?.recentActivity.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.activityRow,
                      index < stats.recentActivity.length - 1 &&
                        styles.activityRowBorder,
                    ]}
                  >
                    <View style={styles.activityIcon}>{activityIcon(item.type)}</View>
                    <View style={styles.activityBody}>
                      <Text style={styles.activityTitle}>{item.title}</Text>
                      <Text style={styles.activitySubtitle} numberOfLines={2}>
                        {item.subtitle}
                      </Text>
                    </View>
                    <Text style={styles.activityTime}>
                      {formatRelativeTime(item.timestamp)}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}

        <Text style={styles.quickLinksLabel}>Manage</Text>
        <View style={styles.quickLinks}>
          <TouchableOpacity
            style={styles.quickLink}
            onPress={() => navigation.navigate('AdminCourses')}
          >
            <BookMarked size={20} color={colors.primary} />
            <Text style={styles.quickLinkText}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickLink}
            onPress={() => navigation.navigate('AdminAssessments')}
          >
            <ListChecks size={20} color={colors.primary} />
            <Text style={styles.quickLinkText}>Questions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickLink}
            onPress={() => navigation.navigate('AdminData')}
          >
            <Database size={20} color={colors.primary} />
            <Text style={styles.quickLinkText}>Records</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing['2xl'] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  headerText: { flex: 1 },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  firebaseBadge: {
    fontSize: typography.sizes.xs,
    color: colors.success,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.lg,
  },
  loader: { marginVertical: spacing['2xl'] },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  statCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: typography.weights.medium,
  },
  completionHint: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 18,
  },
  section: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  emptyActivity: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  activityRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityIcon: {
    marginTop: 2,
  },
  activityBody: { flex: 1 },
  activityTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  activitySubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  quickLinksLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  quickLinkText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  logoutText: { color: colors.error, fontWeight: typography.weights.semibold },
});

export default AdminDashboardScreen;
