import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { Recommendation } from '../utils/types';
import { ArrowRight, BookOpen, Medal } from 'lucide-react-native';
import { PressableScale } from './PressableScale';

interface RecommendationItemProps {
  recommendation: Recommendation;
  onPress: () => void;
  rank?: number;
}

export const RecommendationItem: React.FC<RecommendationItemProps> = ({
  recommendation,
  onPress,
  rank,
}) => {
  const isTop = rank === 1;

  return (
    <PressableScale
      style={[
        styles.container,
        shadows.sm,
        isTop && styles.containerTop,
      ]}
      onPress={onPress}
      pressedScale={0.985}
    >
      <View style={styles.header}>
        <View style={[styles.iconBackground, isTop && styles.iconBackgroundTop]}>
          {isTop ? (
            <Medal size={22} color="#FFFFFF" />
          ) : (
            <BookOpen size={22} color={colors.highlight} />
          )}
        </View>
        <View style={styles.headerContent}>
          {rank != null ? (
            <Text style={[styles.rankLabel, isTop && styles.rankLabelTop]}>
              #{rank} match
            </Text>
          ) : null}
          <Text style={styles.title} numberOfLines={2}>
            {recommendation.title}
          </Text>
          <View style={styles.badgesRow}>
            {recommendation.matchPercent != null && (
              <View style={[styles.badge, isTop && styles.badgeTop]}>
                <Text style={[styles.badgeText, isTop && styles.badgeTextTop]}>
                  {recommendation.matchPercent}% fit
                </Text>
              </View>
            )}
            <View style={styles.badgeMuted}>
              <Text style={styles.badgeMutedText}>
                {recommendation.estimatedDuration}
              </Text>
            </View>
            {recommendation.courses[0]?.estimatedTuitionPerTerm ? (
              <View style={styles.badgeMuted}>
                <Text style={styles.badgeMutedText}>
                  {recommendation.courses[0].estimatedTuitionPerTerm}/term
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {recommendation.description}
      </Text>

      {recommendation.careerApplications.length > 0 && (
        <View style={styles.careerSection}>
          <Text style={styles.sectionLabel}>Career paths</Text>
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

      <View style={styles.footer}>
        <Text style={styles.courseCount}>
          {recommendation.courses[0]?.title || 'View program'}
        </Text>
        <View style={styles.footerCta}>
          <Text style={styles.footerCtaText}>Details</Text>
          <ArrowRight size={18} color={colors.highlight} />
        </View>
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(149, 189, 215, 0.4)',
  },
  containerTop: {
    borderColor: colors.highlight,
    backgroundColor: colors.highlightSoft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.45)',
  },
  iconBackgroundTop: {
    backgroundColor: colors.highlight,
    borderColor: colors.highlight,
  },
  headerContent: {
    flex: 1,
    gap: spacing.xs,
  },
  rankLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rankLabelTop: {
    color: colors.highlight,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.highlightSoft,
  },
  badgeTop: {
    backgroundColor: colors.highlight,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },
  badgeTextTop: {
    color: '#FFFFFF',
  },
  badgeMuted: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.45)',
  },
  badgeMutedText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  careerSection: {
    marginBottom: spacing.md,
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
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.45)',
  },
  careerTagText: {
    fontSize: typography.sizes.xs,
    color: colors.highlight,
    fontWeight: typography.weights.medium,
  },
  moreCareerText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(149, 189, 215, 0.35)',
  },
  courseCount: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  footerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerCtaText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },
});
