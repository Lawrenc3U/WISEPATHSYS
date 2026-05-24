import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { logoutUser, saveUserProfile } from '../services/authService';
import {
  deleteAssessmentResult,
  deleteAllUserAssessments,
} from '../services/userDataService';
import {
  clearAllUserCourseProgress,
  deleteCourseProgressRecord,
} from '../services/progressService';
import { ProfileScreenProps } from '../navigation/types';
import { Award, Zap, Clock, Lightbulb, Trash2 } from 'lucide-react-native';
import { QuizResult } from '../utils/types';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const userProfile = useUserStore((state) => state.userProfile);
  const quizHistory = useUserStore((state) => state.quizHistory);
  const clearQuizAnswers = useUserStore((state) => state.clearQuizAnswers);
  const removeQuizResult = useUserStore((state) => state.removeQuizResult);
  const clearQuizHistory = useUserStore((state) => state.clearQuizHistory);
  const setUserProfile = useUserStore((state) => state.setUserProfile);
  const setProgressByCourse = useUserStore((state) => state.setProgressByCourse);
  const setStudentProgress = useUserStore((state) => state.setStudentProgress);
  const account = useAuthStore((state) => state.account);
  const logout = useAuthStore((state) => state.logout);
  const resetUserSession = useUserStore((state) => state.resetUserSession);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);

  const sortedHistory = useMemo(
    () =>
      [...quizHistory].sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      ),
    [quizHistory]
  );

  const latestResult = sortedHistory[0];

  const persistProfileHistory = async (history: QuizResult[]) => {
    if (!account?.uid || !userProfile) return;
    const updated: typeof userProfile = {
      ...userProfile,
      quizHistory: history,
      selectedPath: history[0]?.recommendedPaths?.[0],
      progress: history.length > 0 ? userProfile.progress : undefined,
    };
    setUserProfile(updated);
    try {
      await saveUserProfile(account.uid, updated);
    } catch (error) {
      console.error('[ProfileScreen] save profile after history change:', error);
    }
  };

  /** No assessments → academic progress back to 0 / cleared */
  const syncProgressAfterAssessmentRemoval = async (
    deletedResult?: QuizResult
  ) => {
    const history = useUserStore.getState().quizHistory;

    if (history.length === 0) {
      if (account?.uid) {
        await clearAllUserCourseProgress(account.uid);
      }
      setProgressByCourse({});
      setStudentProgress(null);
      return;
    }

    const courseIds = new Set<string>();
    if (deletedResult?.bestCourseId) {
      courseIds.add(deletedResult.bestCourseId);
    }
    deletedResult?.recommendedPaths?.forEach((rec) => {
      rec.courses?.forEach((c) => courseIds.add(c.id));
    });

    if (courseIds.size === 0 || !account?.uid) return;

    await Promise.all(
      [...courseIds].map((id) => deleteCourseProgressRecord(account.uid!, id))
    );

    const nextMap = { ...useUserStore.getState().progressByCourse };
    courseIds.forEach((id) => delete nextMap[id]);
    setProgressByCourse(nextMap);

    const selectedId = useUserStore.getState().selectedCourseId;
    if (selectedId && courseIds.has(selectedId)) {
      setStudentProgress(null);
    }
  };

  const handleDeleteAssessment = (result: QuizResult, storeIndex: number) => {
    Alert.alert(
      'Remove assessment',
      'Delete this assessment from your history? Program progress for that result will reset to 0.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(result.id ?? `idx-${storeIndex}`);
            try {
              let remoteDeleted = true;
              if (account?.uid && result.id) {
                try {
                  await deleteAssessmentResult(result.id, account.uid);
                } catch (error: unknown) {
                  const code = (error as { code?: string })?.code;
                  if (code === 'permission-denied') {
                    remoteDeleted = false;
                  } else {
                    throw error;
                  }
                }
              }
              removeQuizResult(result.id ?? storeIndex);
              await syncProgressAfterAssessmentRemoval(result);
              await persistProfileHistory(useUserStore.getState().quizHistory);
              if (!remoteDeleted) {
                Alert.alert(
                  'Removed on device',
                  'History cleared locally. Publish firestore.rules in Firebase Console (wisepath-v2) to sync deletes to the cloud.'
                );
              }
            } catch (error) {
              console.error('[ProfileScreen] delete assessment:', error);
              Alert.alert('Error', 'Could not remove this assessment. Try again.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const handleClearAllHistory = () => {
    if (quizHistory.length === 0) return;

    Alert.alert(
      'Clear all assessments',
      'Remove every assessment from your history? All program progress will reset to 0.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear all',
          style: 'destructive',
          onPress: async () => {
            setClearingAll(true);
            try {
              let remoteCleared = true;
              if (account?.uid) {
                try {
                  await deleteAllUserAssessments(account.uid);
                } catch (error: unknown) {
                  const code = (error as { code?: string })?.code;
                  if (code === 'permission-denied') {
                    remoteCleared = false;
                  } else {
                    throw error;
                  }
                }
              }
              clearQuizHistory();
              await syncProgressAfterAssessmentRemoval();
              await persistProfileHistory([]);
              if (!remoteCleared) {
                Alert.alert(
                  'Cleared on device',
                  'History and progress reset in the app. Publish firestore.rules in Firebase Console (wisepath-v2) to sync with the cloud.'
                );
              }
            } catch (error) {
              console.error('[ProfileScreen] clear history:', error);
              Alert.alert('Error', 'Could not clear assessment history.');
            } finally {
              setClearingAll(false);
            }
          },
        },
      ]
    );
  };

  const handleRetake = () => {
    clearQuizAnswers();
    navigation.navigate('AssessmentQuiz');
  };

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logoutUser();
          logout();
          resetUserSession();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const findStoreIndex = (result: QuizResult) =>
    quizHistory.findIndex((r) =>
      result.id ? r.id === result.id : r.completedAt === result.completedAt
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {(userProfile?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.greetingContent}>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userName}>
              {userProfile?.name || 'Learner'}
            </Text>
          </View>
        </View>

        {userProfile && (
          <View style={[styles.card, shadows.md]}>
            <View style={styles.cardHeader}>
              <Lightbulb size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Your Learning Profile</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Learning Goals</Text>
              <Text style={styles.profileValue}>
                {userProfile.learningGoals}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Current Level</Text>
              <Text style={styles.profileValue}>{userProfile.currentSkills}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Learning Style</Text>
              <Text style={styles.profileValue}>{userProfile.learningStyle}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Time Commitment</Text>
              <Text style={styles.profileValue}>{userProfile.experience}</Text>
            </View>
          </View>
        )}

        {userProfile?.selectedPath && (
          <View style={[styles.card, shadows.md]}>
            <View style={styles.cardHeader}>
              <Award size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Your Learning Path</Text>
            </View>
            <Text style={styles.selectedPathTitle}>
              {userProfile.selectedPath.title}
            </Text>
            <Text style={styles.selectedPathDescription}>
              {userProfile.selectedPath.description}
            </Text>
            <View style={styles.pathStats}>
              <View style={styles.pathStatItem}>
                <Clock size={16} color={colors.primary} />
                <Text style={styles.pathStatText}>
                  {userProfile.selectedPath.estimatedDuration}
                </Text>
              </View>
              <View style={styles.pathStatItem}>
                <Zap size={16} color={colors.primary} />
                <Text style={styles.pathStatText}>
                  {userProfile.selectedPath.courses.length} Courses
                </Text>
              </View>
            </View>
          </View>
        )}

        {latestResult && latestResult.strengths.length > 0 && (
          <View style={[styles.card, shadows.md]}>
            <View style={styles.cardHeader}>
              <Zap size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Your Strengths</Text>
            </View>
            <Text style={styles.strengthsHint}>
              From your most recent assessment
            </Text>
            <View style={styles.strengthsList}>
              {latestResult.strengths.map((strength, index) => (
                <View key={index} style={styles.strengthItem}>
                  <View style={styles.strengthCheckmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                  <Text style={styles.strengthText}>{strength}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {sortedHistory.length > 0 && (
          <View style={[styles.card, shadows.md]}>
            <View style={styles.historyCardHeader}>
              <View style={styles.historyTitleRow}>
                <Clock size={24} color={colors.primary} />
                <Text style={styles.cardTitle}>Assessment History</Text>
              </View>
              <TouchableOpacity
                onPress={handleClearAllHistory}
                disabled={clearingAll}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {clearingAll ? (
                  <ActivityIndicator size="small" color={colors.error} />
                ) : (
                  <Text style={styles.clearAllText}>Clear all</Text>
                )}
              </TouchableOpacity>
            </View>

            {sortedHistory.map((result, displayIndex) => {
              const storeIndex = findStoreIndex(result);
              const itemKey = result.id ?? `local-${result.completedAt}`;
              const isDeleting =
                deletingId === result.id || deletingId === `idx-${storeIndex}`;
              const topMatch = result.recommendedPaths[0]?.courses[0]?.title;

              return (
                <View
                  key={itemKey}
                  style={[
                    styles.historyItem,
                    displayIndex < sortedHistory.length - 1 && styles.historyItemBorder,
                  ]}
                >
                  <View style={styles.historyDate}>
                    <Text style={styles.historyDateText}>
                      {new Date(result.completedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle}>
                      Assessment #{sortedHistory.length - displayIndex}
                    </Text>
                    <Text style={styles.historySubtitle}>
                      {result.recommendedPaths.length} program
                      {result.recommendedPaths.length !== 1 ? 's' : ''} ranked
                      {topMatch ? ` · Top: ${topMatch}` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAssessment(result, storeIndex)}
                    disabled={isDeleting}
                    accessibilityLabel="Remove assessment"
                  >
                    {isDeleting ? (
                      <ActivityIndicator size="small" color={colors.error} />
                    ) : (
                      <Trash2 size={20} color={colors.error} />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={[styles.retakeButton, shadows.md]}
          onPress={handleRetake}
        >
          <Text style={styles.retakeButtonText}>Retake Assessment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.background,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
  },
  greetingContent: {
    flex: 1,
    gap: spacing.xs,
  },
  greeting: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  userName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  clearAllText: {
    fontSize: typography.sizes.sm,
    color: colors.error,
    fontWeight: typography.weights.semibold,
  },
  profileItem: {
    gap: spacing.xs,
  },
  profileLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
  },
  profileValue: {
    fontSize: typography.sizes.base,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  selectedPathTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  selectedPathDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  pathStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  pathStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pathStatText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  strengthsHint: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: -spacing.md,
    marginBottom: spacing.md,
  },
  strengthsList: {
    gap: spacing.md,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  strengthCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.background,
    fontWeight: typography.weights.bold,
  },
  strengthText: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  historyDateText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  historyContent: {
    flex: 1,
    gap: spacing.xs,
  },
  historyTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  historySubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  retakeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  retakeButtonText: {
    color: colors.background,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
  logoutButton: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoutButtonText: {
    color: colors.error,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.base,
  },
});

export default ProfileScreen;
