import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { AdminDataScreenProps } from '../navigation/types';
import { getAssessmentRecords } from '../services/adminService';
import { QuizResult } from '../utils/types';
import { isFirebaseConfigured } from '../services/firebase';

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
          <Text style={styles.empty}>No assessment data yet.</Text>
        ) : (
          records.map((record) => (
            <View key={record.id || record.completedAt.toString()} style={styles.card}>
              <Text style={styles.cardTitle}>
                Student: {record.userId?.slice(0, 12) || 'Unknown'}…
              </Text>
              <Text style={styles.meta}>
                {new Date(record.completedAt).toLocaleString()}
              </Text>
              <Text style={styles.meta}>
                Best match: {record.bestCourseId || record.recommendedPaths[0]?.courses[0]?.id || '—'}
              </Text>
              <Text style={styles.strengths}>
                Strengths: {record.strengths.slice(0, 2).join(', ')}
                {record.strengths.length > 2 ? '…' : ''}
              </Text>
              <Text style={styles.rec}>
                {record.recommendedPaths[0]?.title || 'No recommendation title'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  banner: {
    backgroundColor: '#FFF8E6',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  bannerText: { fontSize: typography.sizes.sm, color: colors.text },
  count: {
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
    color: colors.text,
  },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontWeight: typography.weights.bold, color: colors.text },
  meta: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: spacing.xs },
  strengths: { fontSize: typography.sizes.sm, color: colors.text, marginTop: spacing.sm },
  rec: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.xs,
  },
});

export default AdminDataScreen;
