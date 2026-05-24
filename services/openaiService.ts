import { Recommendation } from '../utils/types';
import axios from 'axios';

declare const process:
  | {
      env?: {
        [key: string]: string | undefined;
      };
    }
  | undefined;

const API_BASE_URL =
  typeof process !== 'undefined' && process.env?.OPENAI_API_URL
    ? process.env.OPENAI_API_URL
    : 'http://localhost:3000/api';

interface RecommendationRequest {
  learningGoals: string;
  currentSkills: string;
  learningStyle: string;
  experience: string;
  timeCommitment: string;
  interestLevel: number;
}

/**
 * Get personalized learning path recommendations from OpenAI
 * Requires backend endpoint at POST /api/recommendations
 */
export const getRecommendations = async (
  quizAnswers: Record<string, string>
): Promise<Recommendation[]> => {
  try {
    const payload: RecommendationRequest = {
      learningGoals: quizAnswers.q1 || '',
      currentSkills: quizAnswers.q2 || '',
      learningStyle: quizAnswers.q3 || '',
      experience: quizAnswers.q4 || '',
      timeCommitment: quizAnswers.q4 || '',
      interestLevel: parseInt(quizAnswers.q5 || '3', 10),
    };

    console.log(
      '[OpenAI] Requesting recommendations with payload:',
      payload
    );

    const response = await axios.post(
      `${API_BASE_URL}/recommendations`,
      payload,
      {
        timeout: 30000,
      }
    );

    if (response.status === 200 && response.data.recommendations) {
      return response.data.recommendations;
    }

    console.warn('[OpenAI] Unexpected response format:', response.data);
    return [];
  } catch (error) {
    console.error('[OpenAI] Error fetching recommendations:', error);
    // Return empty array on error - frontend will handle gracefully
    return [];
  }
};

/**
 * Backend endpoint structure for /api/recommendations
 * Expected to be implemented in a separate backend service
 *
 * POST /api/recommendations
 * Body: {
 *   learningGoals: string,
 *   currentSkills: string,
 *   learningStyle: string,
 *   experience: string,
 *   timeCommitment: string,
 *   interestLevel: number
 * }
 *
 * Response: {
 *   recommendations: Recommendation[]
 * }
 *
 * This function calls OpenAI GPT-4 API with a system prompt like:
 * "You are an education advisor. Based on the user's learning profile,
 *  recommend 3-5 personalized learning paths with title, description,
 *  estimated duration, required skills, and career applications."
 */
