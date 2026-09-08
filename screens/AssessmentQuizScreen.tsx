import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { QuestionCard } from '../components/QuestionCard';
import { useUserStore } from '../stores/userStore';
import {
  getCurrentQuestion,
  getTotalQuestions,
  generateStrengths,
  getBestMatchingCourse,
  buildAllRecommendations,
  getCourseRankings,
} from '../services/quizService';
import { saveAssessmentResult } from '../services/userDataService';
import { applyAssessmentToProgress } from '../services/progressService';
import { saveUserProfile } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { AssessmentQuizScreenProps } from '../navigation/types';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';

const AssessmentQuizScreen: React.FC<AssessmentQuizScreenProps> = ({
  navigation,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions] = useState(getTotalQuestions());
  const [submitting, setSubmitting] = useState(false);

  const quizAnswers = useUserStore((state) => state.quizAnswers);
  const setQuizAnswer = useUserStore((state) => state.setQuizAnswer);
  const setUserProfile = useUserStore((state) => state.setUserProfile);
  const setCurrentRecommendations = useUserStore(
    (state) => state.setCurrentRecommendations
  );
  const addQuizResult = useUserStore((state) => state.addQuizResult);
  const userProfile = useUserStore((state) => state.userProfile);
  const setSelectedCourseId = useUserStore((state) => state.setSelectedCourseId);
  const setStudentProgress = useUserStore((state) => state.setStudentProgress);
  const setCourseProgress = useUserStore((state) => state.setCourseProgress);
  const account = useAuthStore((state) => state.account);

  const currentQuestion = getCurrentQuestion(currentQuestionIndex);
  const answeredCount = Object.keys(quizAnswers).length;
  const progress = (currentQuestionIndex + 1) / Math.max(totalQuestions, 1);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const bestCourse = getBestMatchingCourse(quizAnswers, userProfile);
      const strengths = generateStrengths(quizAnswers, userProfile);
      const recommendations = buildAllRecommendations(quizAnswers, userProfile);
      const courseRankings = getCourseRankings(quizAnswers, userProfile);
      const topRecommendation = recommendations[0];

      const updatedProfile = {
        ...userProfile,
        name: userProfile?.name || 'Student',
        email: userProfile?.email || account?.email,
        currentSkills: userProfile?.currentSkills || 'Beginner',
        learningStyle: userProfile?.learningStyle || 'Mixed',
        experience: userProfile?.experience || '0-1 year',
        seniorHighStrand:
          userProfile?.seniorHighStrand ||
          userProfile?.shsStrand ||
          'Other / Undecided',
        shsStrand: userProfile?.shsStrand || userProfile?.seniorHighStrand,
        learningGoals: userProfile?.learningGoals?.length
          ? userProfile.learningGoals
          : ['Career advancement'],
        careerInterests: userProfile?.careerInterests || [],
        selectedPath: topRecommendation,
        quizHistory: userProfile?.quizHistory || [],
      };

      setUserProfile(updatedProfile);
      setCurrentRecommendations(recommendations);

      const result = {
        quizAnswers,
        strengths,
        recommendedPaths: recommendations,
        courseRankings,
        bestCourseId: bestCourse.id,
        completedAt: new Date(),
      };

      setSelectedCourseId(bestCourse.id);

      if (account?.uid) {
        const assessmentId = await saveAssessmentResult(account.uid, result);
        addQuizResult({ ...result, id: assessmentId, userId: account.uid });
        const progressData = await applyAssessmentToProgress(
          account.uid,
          bestCourse.id
        );
        setCourseProgress(bestCourse.id, progressData);
        setStudentProgress(progressData);

        const profileWithHistory = {
          ...updatedProfile,
          progress: progressData,
          quizHistory: [
            ...(userProfile?.quizHistory || []),
            { ...result, id: assessmentId, userId: account.uid },
          ],
        };
        setUserProfile(profileWithHistory);
        await saveUserProfile(account.uid, profileWithHistory);
      } else {
        addQuizResult(result);
      }

      navigation.replace('Recommendations');
    } catch (error) {
      console.error('[AssessmentQuiz] Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isQuizComplete = answeredCount === totalQuestions;
  const canProceed =
    currentQuestion && quizAnswers[currentQuestion.id] !== undefined;
  const isLast = currentQuestionIndex === totalQuestions - 1;

  if (!currentQuestion) {
    return (
      <ScreenWrapper gradient>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Question not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper gradient>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerIcon}>
              <ClipboardList size={20} color={colors.highlight} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>Career assessment</Text>
              <Text style={styles.title}>Find your best fit</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            Combined with your profile to rank your top 3 programs. Answer
            honestly.
          </Text>

          <View style={styles.progressMeta}>
            <Text style={styles.progressLabel}>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </Text>
            <Text style={styles.progressPercent}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <View style={styles.dotRow}>
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const q = getCurrentQuestion(i);
              const answered = q ? quizAnswers[q.id] !== undefined : false;
              const active = i === currentQuestionIndex;
              return (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    answered && styles.dotAnswered,
                    active && styles.dotActive,
                  ]}
                />
              );
            })}
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.questionShell, shadows.sm]}>
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={quizAnswers[currentQuestion.id]}
              onSelectAnswer={(answer) =>
                setQuizAnswer(currentQuestion.id, answer)
              }
              progress={progress}
              hideProgress
              questionNumber={currentQuestionIndex + 1}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              currentQuestionIndex === 0 && styles.disabledButton,
            ]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            activeOpacity={0.75}
          >
            <ChevronLeft size={20} color={colors.highlight} />
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>

          {isLast ? (
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!isQuizComplete || submitting) && styles.disabledButton,
              ]}
              onPress={handleSubmitQuiz}
              disabled={!isQuizComplete || submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>See Top 3 Matches</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.primaryButton,
                !canProceed && styles.disabledButton,
              ]}
              onPress={handleNextQuestion}
              disabled={!canProceed}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.base,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.45)',
  },
  headerText: { flex: 1 },
  eyebrow: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.highlight,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  progressPercent: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.highlight,
  },
  progressTrack: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.highlightSoft,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.highlight,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(149, 189, 215, 0.45)',
  },
  dotAnswered: {
    backgroundColor: colors.accent,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.highlight,
  },
  content: { flex: 1 },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  questionShell: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.35)',
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(149, 189, 215, 0.35)',
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  primaryButton: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highlight,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    shadowColor: colors.highlight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.highlight,
  },
  secondaryButtonText: {
    color: colors.highlight,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.base,
  },
  disabledButton: {
    opacity: 0.45,
  },
});

export default AssessmentQuizScreen;
