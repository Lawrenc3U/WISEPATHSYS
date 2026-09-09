import { Course } from './types';
import { SAMPLE_COURSES } from './constants';

/** Merge Firestore courses with bundled catalog metadata (tuition, skills, etc.). */
export const mergeCatalogCourses = (fromFirebase: Course[]): Course[] => {
  if (fromFirebase.length === 0) return SAMPLE_COURSES;

  const storedById = new Map(fromFirebase.map((course) => [course.id, course]));

  const merged = SAMPLE_COURSES.map((fallback) => {
    const stored = storedById.get(fallback.id);
    if (!stored) return fallback;
    return {
      ...fallback,
      ...stored,
      estimatedTuitionPerTerm:
        stored.estimatedTuitionPerTerm || fallback.estimatedTuitionPerTerm,
    };
  });

  fromFirebase.forEach((stored) => {
    if (!SAMPLE_COURSES.some((course) => course.id === stored.id)) {
      merged.push(stored);
    }
  });

  return merged;
};

export const getCatalogOrFallback = (courses: Course[]): Course[] =>
  courses.length > 0 ? courses : SAMPLE_COURSES;
