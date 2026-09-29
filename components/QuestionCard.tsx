import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { QuizQuestion } from '../utils/types';
import { PressableScale } from './PressableScale';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedAnswer: string | undefined;
  onSelectAnswer: (answer: string) => void;
  progress: number;
  hideProgress?: boolean;
  questionNumber?: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  progress,
  hideProgress = false,
  questionNumber,
}) => {
  const renderMultipleChoice = () => (
    <View style={styles.optionsContainer}>
      {question.options?.map((option, index) => {
        const indexKey = index.toString();
        const isSelected = selectedAnswer === indexKey;
        const letter = String.fromCharCode(65 + index);
        return (
          <PressableScale
            key={`${question.id}-${index}`}
            style={[
              styles.optionButton,
              isSelected && styles.optionButtonSelected,
            ]}
            onPress={() => onSelectAnswer(indexKey)}
            pressedScale={0.985}
          >
            <View
              style={[
                styles.optionLetter,
                isSelected && styles.optionLetterSelected,
              ]}
            >
              {isSelected ? (
                <Check size={14} color={colors.surfaceElevated} strokeWidth={3} />
              ) : (
                <Text style={styles.optionLetterText}>{letter}</Text>
              )}
            </View>
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </PressableScale>
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
        {scales.map((scale) => {
          const isSelected = selectedAnswer === scale;
          return (
            <PressableScale
              key={scale}
              style={[
                styles.scaleButton,
                isSelected && styles.scaleButtonSelected,
              ]}
              onPress={() => onSelectAnswer(scale)}
              pressedScale={0.96}
            >
              <Text
                style={[
                  styles.scaleText,
                  isSelected && styles.scaleTextSelected,
                ]}
              >
                {scale}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!hideProgress && (
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
      )}

      <View style={styles.questionContainer}>
        {questionNumber != null ? (
          <Text style={styles.questionBadge}>Q{questionNumber}</Text>
        ) : null}
        <Text style={styles.questionText}>{question.text}</Text>
        <Text style={styles.hintText}>Select the option that fits you best</Text>
      </View>

      {question.type === 'multipleChoice'
        ? renderMultipleChoice()
        : renderScale()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  progressContainer: {
    marginBottom: spacing.xl,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.highlightSoft,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.highlight,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  questionContainer: {
    marginBottom: spacing.xl,
  },
  questionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.highlightSoft,
    color: colors.highlight,
    overflow: 'hidden',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  questionText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  hintText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surfaceElevated,
  },
  optionButtonSelected: {
    borderColor: colors.highlight,
    backgroundColor: colors.highlight,
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterSelected: {
    borderColor: colors.surfaceElevated,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  optionLetterText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },
  optionText: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.text,
    fontWeight: typography.weights.medium,
    lineHeight: 22,
  },
  optionTextSelected: {
    color: colors.surfaceElevated,
    fontWeight: typography.weights.bold,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  scaleButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.highlightSoft,
  },
  scaleButtonSelected: {
    borderColor: colors.highlight,
    backgroundColor: colors.highlight,
  },
  scaleText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  scaleTextSelected: {
    color: colors.surfaceElevated,
  },
});
