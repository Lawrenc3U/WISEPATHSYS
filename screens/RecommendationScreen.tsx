import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import { colors, spacing } from '../utils/theme';
import { RecommendationItem } from '../components/RecommendationItem';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useUserStore } from '../stores/userStore';
import { useCourseStore } from '../stores/courseStore';
import { RecommendationsScreenProps } from '../navigation/types';

const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const currentRecommendations = useUserStore(
    (state) => state.currentRecommendations
  );
  const setSelectedPath = useUserStore((state) => state.setSelectedPath);

  // For now, we'll use mock recommendations
  // In production, this would call OpenAI via the backend endpoint
  const recommendations = currentRecommendations;

  const handleRecommendationPress = (recommendationId: string) => {
    const recommendation = recommendations.find((r) => r.id === recommendationId);
    if (recommendation) {
      setSelectedPath(recommendation);
      if (recommendation.courses.length > 0) {
        navigation.navigate('CourseDetail', {
          courseId: recommendation.courses[0].id,
        });
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Generating recommendations..." />;
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No recommendations found</Text>
          <Text style={styles.emptyText}>
            Please complete the assessment to get personalized recommendations.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Based on your assessment</Text>
          <Text style={styles.subtitle}>
            We've curated {recommendations.length} learning path
            {recommendations.length !== 1 ? 's' : ''} for you
          </Text>
        </View>

        <View style={styles.recommendationsList}>
          {recommendations.map((recommendation) => (
            <RecommendationItem
              key={recommendation.id}
              recommendation={recommendation}
              onPress={() => handleRecommendationPress(recommendation.id)}
            />
          ))}
        </View>
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
    marginBottom: spacing['2xl'],
    gap: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  recommendationsList: {
    gap: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default RecommendationsScreen;
