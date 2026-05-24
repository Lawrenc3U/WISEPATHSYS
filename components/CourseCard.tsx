import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { Course } from '../utils/types';
import { Clock, Award } from 'lucide-react-native';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, shadows.md]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {course.description}
      </Text>

      {/* Meta info (duration and skills) */}
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Clock size={16} color={colors.primary} />
          <Text style={styles.metaText}>{course.duration}</Text>
        </View>
        <View style={styles.metaItem}>
          <Award size={16} color={colors.primary} />
          <Text style={styles.metaText}>{course.skills.length} skills</Text>
        </View>
      </View>

      {/* Skills preview */}
      <View style={styles.skillsContainer}>
        {course.skills.slice(0, 2).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {course.skills.length > 2 && (
          <View style={styles.skillTag}>
            <Text style={styles.skillText}>+{course.skills.length - 2}</Text>
          </View>
        )}
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
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  skillsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  skillText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
});
