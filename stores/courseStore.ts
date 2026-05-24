import { create } from 'zustand';
import { Course, QuizQuestion } from '../utils/types';
import { QUIZ_QUESTIONS } from '../utils/constants';

interface CourseStore {
  allCourses: Course[];
  quizQuestions: QuizQuestion[];
  selectedCourseId: string | null;
  isLoadingCourses: boolean;
  setAllCourses: (courses: Course[]) => void;
  setQuizQuestions: (questions: QuizQuestion[]) => void;
  setSelectedCourse: (id: string) => void;
  setIsLoadingCourses: (loading: boolean) => void;
  getCourseById: (id: string) => Course | undefined;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  allCourses: [],
  quizQuestions: QUIZ_QUESTIONS,
  selectedCourseId: null,
  isLoadingCourses: false,

  setAllCourses: (courses: Course[]) => set({ allCourses: courses }),

  setQuizQuestions: (questions: QuizQuestion[]) =>
    set({ quizQuestions: questions }),

  setSelectedCourse: (id: string) => set({ selectedCourseId: id }),

  setIsLoadingCourses: (loading: boolean) => set({ isLoadingCourses: loading }),

  getCourseById: (id: string) => {
    const state = get();
    return state.allCourses.find((course) => course.id === id);
  },
}));
