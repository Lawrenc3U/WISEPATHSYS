import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { Recommendation } from '../utils/types';
import { ArrowRight, BookOpen } from 'lucide-react-native';

interface RecommendationItemProps {
  recommendation: Recommendation;
  onPress: () => void;
}

export const RecommendationItem: React.FC<RecommendationItemProps> = ({
  recommendation,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, shadows.md]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header with gradient accent */}
      <View style={styles.header}>
        <View style={styles.iconSection}>
          <View style={styles.iconBackground}>
            <BookOpen size={24} color={colors.primary} />
          </View>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={2}>
            {recommendation.title}
          </Text>
          <View style={styles.badgesRow}>
            {recommendation.matchPercent != null && (
              <View style={[styles.badge, { backgroundColor: colors.primary + '18' }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  {recommendation.matchPercent}% fit
                </Text>
              </View>
            )}
            <View style={[styles.badge, { backgroundColor: colors.surface }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                {recommendation.estimatedDuration}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {recommendation.description}
      </Text>

      {/* Career paths preview */}
      {recommendation.careerApplications.length > 0 && (
        <View style={styles.careerSection}>
          <Text style={styles.sectionLabel}>Career Paths</Text>
          <View style={styles.careerTags}>
            {recommendation.careerApplications.slice(0, 2).map((career, index) => (
              <View key={index} style={styles.careerTag}>
                <Text style={styles.careerTagText}>{career}</Text>
              </View>
            ))}
            {recommendation.careerApplications.length > 2 && (
              <Text style={styles.moreCareerText}>
                +{recommendation.careerApplications.length - 2} more
              </Text>
            )}
          </View>
        </View>
      )}

      {/* CTA Footer */}
      <View style={styles.footer}>
        <Text style={styles.courseCount}>
          {recommendation.courses.length} courses included
        </Text>
        <ArrowRight size={20} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  iconSection: {
    marginTop: spacing.xs,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  careerSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  careerTags: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  careerTag: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  careerTagText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  moreCareerText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  courseCount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
});
