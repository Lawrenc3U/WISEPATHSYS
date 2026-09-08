import { UserProfile, Course } from '../utils/types';
import { SAMPLE_COURSES } from '../utils/constants';

/**
 * Simulates calling a Cloud Function that interfaces with an LLM (e.g. Gemini).
 * In a real environment, you would use `httpsCallable` from firebase/functions.
 */
export const getAIAnalysis = async (
  profile: UserProfile,
  assessmentScores: { courseId: string; score: number }[],
  courses: Course[]
): Promise<string> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const topCourseId = assessmentScores.sort((a, b) => b.score - a.score)[0]?.courseId;
  const topCourse = courses.find((c) => c.id === topCourseId);

  // Mock LLM Response
  return `Based on your profile, you lean towards a career in ${
    profile.careerInterests?.join(' and ') || 'various fields'
  }. Your SHS track (${profile.shsStrand}) and learning goals align strongly with the skills required for ${
    topCourse?.title || 'this program'
  }. The assessment shows you have a natural aptitude for this field. I recommend pursuing this path to build your foundational knowledge and prepare for your target career.`;
};

/**
 * Computes a baseline recommendation purely from profile data before any assessment is taken.
 */
export const getBaselineRecommendation = (profile: UserProfile): Course | null => {
  if (!profile.careerInterests || profile.careerInterests.length === 0) {
    return null;
  }

  // Simple heuristic matching
  let recommendedCourse = SAMPLE_COURSES[0];
  let maxScore = 0;

  for (const course of SAMPLE_COURSES) {
    let score = 0;
    
    // Check if any of their career interests loosely match the course description or career paths
    for (const interest of profile.careerInterests) {
      if (course.careerPaths.some((p) => p.toLowerCase().includes(interest.toLowerCase()))) {
        score += 3;
      }
      if (course.description.toLowerCase().includes(interest.toLowerCase())) {
        score += 2;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      recommendedCourse = course;
    }
  }

  return maxScore > 0 ? recommendedCourse : SAMPLE_COURSES[0]; // Fallback to first course
};
