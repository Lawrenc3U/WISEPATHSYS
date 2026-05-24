import { create } from 'zustand';
import { UserProfile, Recommendation, QuizResult, StudentProgress } from '../utils/types';

interface UserStore {
  userProfile: UserProfile | null;
  quizAnswers: Record<string, string>;
  currentRecommendations: Recommendation[];
  isLoadingRecommendations: boolean;
  quizHistory: QuizResult[];
  studentProgress: StudentProgress | null;
  progressByCourse: Record<string, StudentProgress>;
  selectedCourseId: string | null;
  
  setUserProfile: (profile: UserProfile) => void;
  setQuizAnswer: (questionId: string, answer: string) => void;
  setCurrentRecommendations: (recommendations: Recommendation[]) => void;
  setIsLoadingRecommendations: (loading: boolean) => void;
  addQuizResult: (result: QuizResult) => void;
  removeQuizResult: (idOrIndex: string | number) => void;
  clearQuizHistory: () => void;
  clearQuizAnswers: () => void;
  setSelectedPath: (recommendation: Recommendation) => void;
  setStudentProgress: (progress: StudentProgress) => void;
  setProgressByCourse: (map: Record<string, StudentProgress>) => void;
  setCourseProgress: (courseId: string, progress: StudentProgress) => void;
  setSelectedCourseId: (courseId: string) => void;
  resetUserSession: () => void;
  hydrateFromAccount: (profile: UserProfile, history?: QuizResult[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userProfile: null,
  quizAnswers: {},
  currentRecommendations: [],
  isLoadingRecommendations: false,
  quizHistory: [],
  studentProgress: null,
  progressByCourse: {},
  selectedCourseId: null,

  setUserProfile: (profile: UserProfile) => set({ userProfile: profile }),

  setQuizAnswer: (questionId: string, answer: string) =>
    set((state) => ({
      quizAnswers: {
        ...state.quizAnswers,
        [questionId]: answer,
      },
    })),

  setCurrentRecommendations: (recommendations: Recommendation[]) =>
    set({ currentRecommendations: recommendations }),

  setIsLoadingRecommendations: (loading: boolean) =>
    set({ isLoadingRecommendations: loading }),

  addQuizResult: (result: QuizResult) =>
    set((state) => ({
      quizHistory: [...state.quizHistory, result],
    })),

  removeQuizResult: (idOrIndex: string | number) =>
    set((state) => {
      const quizHistory =
        typeof idOrIndex === 'string'
          ? state.quizHistory.filter((r) => r.id !== idOrIndex)
          : state.quizHistory.filter((_, i) => i !== idOrIndex);
      const latest = [...quizHistory].sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )[0];
      return {
        quizHistory,
        currentRecommendations: latest?.recommendedPaths ?? [],
        userProfile: state.userProfile
          ? {
              ...state.userProfile,
              selectedPath: latest?.recommendedPaths?.[0],
              quizHistory,
            }
          : null,
      };
    }),

  clearQuizHistory: () =>
    set((state) => ({
      quizHistory: [],
      currentRecommendations: [],
      userProfile: state.userProfile
        ? { ...state.userProfile, selectedPath: undefined, quizHistory: [] }
        : null,
    })),

  clearQuizAnswers: () =>
    set({
      quizAnswers: {},
    }),

  setSelectedPath: (recommendation: Recommendation) =>
    set((state) => ({
      userProfile: state.userProfile
        ? { ...state.userProfile, selectedPath: recommendation }
        : null,
    })),

  setStudentProgress: (progress: StudentProgress) =>
    set({ studentProgress: progress }),

  setProgressByCourse: (map: Record<string, StudentProgress>) =>
    set({ progressByCourse: map }),

  setCourseProgress: (courseId: string, progress: StudentProgress) =>
    set((state) => ({
      progressByCourse: {
        ...state.progressByCourse,
        [courseId]: progress,
      },
      studentProgress:
        state.selectedCourseId === courseId ? progress : state.studentProgress,
    })),

  setSelectedCourseId: (courseId: string) =>
    set((state) => ({
      selectedCourseId: courseId,
      studentProgress: state.progressByCourse[courseId] ?? state.studentProgress,
    })),

  resetUserSession: () =>
    set({
      userProfile: null,
      quizAnswers: {},
      currentRecommendations: [],
      isLoadingRecommendations: false,
      quizHistory: [],
      studentProgress: null,
      progressByCourse: {},
      selectedCourseId: null,
    }),

  hydrateFromAccount: (profile: UserProfile, history: QuizResult[] = []) =>
    set((state) => {
      const courseId = profile.selectedPath?.courses[0]?.id || state.selectedCourseId;
      return {
        userProfile: profile,
        quizHistory: history.length > 0 ? history : profile.quizHistory || [],
        selectedCourseId: courseId,
        studentProgress: profile.progress || state.progressByCourse[courseId || ''] || null,
      };
    }),
}));
