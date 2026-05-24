import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { QuizQuestion } from '../utils/types';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedAnswer: string | undefined;
  onSelectAnswer: (answer: string) => void;
  progress: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  progress,
}) => {
  const renderMultipleChoice = () => (
    <View style={styles.optionsContainer}>
      {question.options?.map((option, index) => {
        const indexKey = index.toString();
        const isSelected = selectedAnswer === indexKey;
        return (
        <TouchableOpacity
          key={`${question.id}-${index}`}
          style={[
            styles.optionButton,
            isSelected && styles.optionButtonSelected,
          ]}
          onPress={() => onSelectAnswer(indexKey)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.optionDot,
              isSelected && styles.optionDotSelected,
            ]}
          />
          <Text
            style={[
              styles.optionText,
              isSelected && styles.optionTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      );
      })}
    </View>
  );

  const renderScale = () => {
    const scales = Array.from(
      { length: question.maxScale || 5 },
      (_, i) => (i + 1).toString()
    );

    return (
      <View style={styles.scaleContainer}>
        {scales.map((scale) => (
          <TouchableOpacity
            key={scale}
            style={[
              styles.scaleButton,
              selectedAnswer === scale && styles.scaleButtonSelected,
            ]}
            onPress={() => onSelectAnswer(scale)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.scaleText,
                selectedAnswer === scale && styles.scaleTextSelected,
              ]}
            >
              {scale}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      scrollEnabled={true}
    >
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBar, { width: `${progress * 100}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}%
        </Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      {/* Answer Options */}
      {question.type === 'multipleChoice'
        ? renderMultipleChoice()
        : renderScale()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  progressContainer: {
    marginBottom: spacing['2xl'],
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  questionContainer: {
    marginBottom: spacing['2xl'],
  },
  questionText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F3EFFF',
  },
  optionDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  optionDotSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing['2xl'],
    gap: spacing.md,
  },
  scaleButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  scaleButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  scaleText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  scaleTextSelected: {
    color: colors.background,
  },
});
