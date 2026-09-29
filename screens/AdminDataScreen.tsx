import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { AdminDataScreenProps } from '../navigation/types';
import { getAssessmentRecords } from '../services/adminService';
import { QuizResult } from '../utils/types';
import { isFirebaseConfigured } from '../services/firebase';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Database } from 'lucide-react-native';

const AdminDataScreen: React.FC<AdminDataScreenProps> = () => {
  const [records, setRecords] = useState<QuizResult[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const data = await getAssessmentRecords();
    setRecords(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <ScreenWrapper gradient>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Database size={24} color={colors.highlight} />
          </View>
          <View>
            <Text style={styles.eyebrow}>Student insights</Text>
            <Text style={styles.pageTitle}>Assessment records</Text>
          </View>
        </View>
        {!isFirebaseConfigured() && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Firebase is not configured. Assessment records appear here once students
              complete quizzes with a connected backend.
            </Text>
          </View>
        )}

        <Text style={styles.count}>
          {records.length} assessment record{records.length !== 1 ? 's' : ''}
        </Text>

        {records.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No assessment data yet</Text>
            <Text style={styles.empty}>
              Records appear here after students complete quizzes.
            </Text>
          </View>
        ) : (
          records.map((record) => (
            <View
              key={record.id || record.completedAt.toString()}
              style={[styles.card, shadows.sm]}
            >
              <Text style={styles.cardTitle}>
                Student: {record.userId?.slice(0, 12) || 'Unknown'}…
              </Text>
              <Text style={styles.meta}>
                {new Date(record.completedAt).toLocaleString()}
              </Text>
              <Text style={styles.meta}>
                Best match:{' '}
                {record.bestCourseId ||
                  record.recommendedPaths[0]?.courses?.[0]?.id ||
                  '—'}
              </Text>
              {record.strengths?.length ? (
                <Text style={styles.strengths}>
                  Strengths: {record.strengths.slice(0, 2).join(', ')}
                  {record.strengths.length > 2 ? '…' : ''}
                </Text>
              ) : null}
              <Text style={styles.rec}>
                {record.recommendedPaths[0]?.title || 'No recommendation title'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing['3xl'] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlightSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: colors.highlight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  pageTitle: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  banner: {
    backgroundColor: colors.highlightSoft,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  bannerText: { fontSize: typography.sizes.sm, color: colors.text },
  count: {
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
    color: colors.text,
  },
  emptyCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardTitle: { fontWeight: typography.weights.bold, color: colors.text },
  meta: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: spacing.xs },
  strengths: { fontSize: typography.sizes.sm, color: colors.text, marginTop: spacing.sm },
  rec: {
    fontSize: typography.sizes.sm,
    color: colors.highlight,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.xs,
  },
});

export default AdminDataScreen;
