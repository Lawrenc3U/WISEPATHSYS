import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
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
import { useAuthStore } from '../stores/authStore';
import { AssessmentQuizScreenProps } from '../navigation/types';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const AssessmentQuizScreen: React.FC<AssessmentQuizScreenProps> = ({
  navigation,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions] = useState(getTotalQuestions());
  
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
  const progress = (currentQuestionIndex + 1) / totalQuestions;

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
    try {
      const bestCourse = getBestMatchingCourse(quizAnswers);
      const strengths = generateStrengths(quizAnswers);
      const recommendations = buildAllRecommendations(quizAnswers);
      const courseRankings = getCourseRankings(quizAnswers);
      const topRecommendation = recommendations[0];

      const updatedProfile = {
        name: userProfile?.name || 'Student',
        email: userProfile?.email || account?.email,
        learningGoals: userProfile?.learningGoals || 'Career advancement',
        currentSkills: userProfile?.currentSkills || 'Beginner',
        learningStyle: userProfile?.learningStyle || 'Mixed',
        experience: userProfile?.experience || '0-1 year',
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
        const progress = await applyAssessmentToProgress(
          account.uid,
          bestCourse.id
        );
        setCourseProgress(bestCourse.id, progress);
        setStudentProgress(progress);

        setUserProfile({
          ...updatedProfile,
          progress,
          quizHistory: [
            ...(userProfile?.quizHistory || []),
            { ...result, id: assessmentId, userId: account.uid },
          ],
        });
      } else {
        addQuizResult(result);
      }

      navigation.replace('Recommendations');
    } catch (error) {
      console.error('[AssessmentQuiz] Error submitting quiz:', error);
    }
  };

  const isQuizComplete =
    Object.keys(quizAnswers).length === totalQuestions;
  const canProceed =
    currentQuestion && quizAnswers[currentQuestion.id] !== undefined;

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Question not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.appName}>WisePath</Text>
          <Text style={styles.subtitle}>
            Answer honestly — we rank all three programs for you
          </Text>
        </View>
      </View>

      {/* Question Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={true}
      >
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={quizAnswers[currentQuestion.id]}
          onSelectAnswer={(answer) => setQuizAnswer(currentQuestion.id, answer)}
          progress={progress}
        />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            currentQuestionIndex === 0 && styles.disabledButton,
          ]}
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={colors.text} />
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !isQuizComplete && styles.disabledButton,
            ]}
            onPress={handleSubmitQuiz}
            disabled={!isQuizComplete}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>Get Recommendations</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.primaryButton, !canProceed && styles.disabledButton]}
            onPress={handleNextQuestion}
            disabled={!canProceed}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
            <ChevronRight size={20} color={colors.background} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    gap: spacing.sm,
  },
  appName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  primaryButtonText: {
    color: colors.background,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  buttonText: {
    color: colors.text,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.base,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default AssessmentQuizScreen;
