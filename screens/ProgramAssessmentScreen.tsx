import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { QuestionCard } from '../components/QuestionCard';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { ProgramAssessmentScreenProps } from '../navigation/types';
import {
  getAssessmentsForCourse,
  completeProgramAssessment,
} from '../services/programAssessmentService';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const ProgramAssessmentScreen: React.FC<ProgramAssessmentScreenProps> = ({
  route,
  navigation,
}) => {
  const { courseId, assessmentId } = route.params;
  const account = useAuthStore((state) => state.account);
  const addProgramAssessmentCompletion = useUserStore(
    (state) => state.addProgramAssessmentCompletion
  );
  const setCourseProgress = useUserStore((state) => state.setCourseProgress);
  const setStudentProgress = useUserStore((state) => state.setStudentProgress);
  const selectedCourseId = useUserStore((state) => state.selectedCourseId);

  const assessment = useMemo(
    () =>
      getAssessmentsForCourse(courseId).find((a) => a.id === assessmentId),
    [courseId, assessmentId]
  );

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!assessment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Assessment not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const questions = assessment.questions;
  const currentQuestion = questions[questionIndex];
  const progress = (questionIndex + 1) / questions.length;
  const currentAnswer = answers[currentQuestion.id];

  const allAnswered = questions.every((q) => answers[q.id]);

  const handleSubmit = async () => {
    if (!allAnswered || !account?.uid) {
      Alert.alert('Complete all questions', 'Please answer every question.');
      return;
    }

    setSubmitting(true);
    try {
      const { completion, progress } = await completeProgramAssessment(
        account.uid,
        courseId,
        assessmentId
      );
      addProgramAssessmentCompletion(completion);
      setCourseProgress(courseId, progress);
      if (selectedCourseId === courseId) {
        setStudentProgress(progress);
      }
      Alert.alert(
        'Assessment complete',
        'Your program progress has been updated.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('[ProgramAssessmentScreen] submit:', error);
      Alert.alert('Error', 'Could not save your assessment. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.programLabel}>{assessment.title}</Text>
        <Text style={styles.description}>{assessment.description}</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {questionIndex + 1} of {questions.length}
        </Text>

        <QuestionCard
          question={currentQuestion}
          selectedAnswer={currentAnswer}
          progress={progress}
          onSelectAnswer={(answer) =>
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
          }
        />

        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navButton, questionIndex === 0 && styles.navDisabled]}
            onPress={() => setQuestionIndex((i) => Math.max(0, i - 1))}
            disabled={questionIndex === 0}
          >
            <ChevronLeft size={20} color={colors.text} />
            <Text style={styles.navText}>Back</Text>
          </TouchableOpacity>

          {questionIndex < questions.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, !currentAnswer && styles.navDisabled]}
              onPress={() =>
                currentAnswer &&
                setQuestionIndex((i) => Math.min(questions.length - 1, i + 1))
              }
              disabled={!currentAnswer}
            >
              <Text style={styles.navText}>Next</Text>
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, (!allAnswered || submitting) && styles.navDisabled]}
              onPress={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              <Text style={styles.submitText}>
                {submitting ? 'Saving...' : 'Finish'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing['3xl'] },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  errorText: { fontSize: typography.sizes.base, color: colors.textSecondary },
  linkText: { color: colors.primary, fontWeight: typography.weights.semibold },
  programLabel: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  progressText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
  },
  navDisabled: { opacity: 0.4 },
  navText: { fontSize: typography.sizes.base, color: colors.text },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  submitText: {
    color: colors.background,
    fontWeight: typography.weights.bold,
  },
});

export default ProgramAssessmentScreen;
