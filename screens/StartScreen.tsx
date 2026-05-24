import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { StartScreenProps } from '../navigation/types';
import { Zap, BookOpen, Users, GraduationCap } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { PrimaryButton } from '../components/PrimaryButton';

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  return (
    <ScreenWrapper gradient>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedFadeIn index={0}>
          <LinearGradient
            colors={[colors.gradientStart, colors.primaryLight, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.logoRing}>
              <GraduationCap size={48} color="#FFF" strokeWidth={1.5} />
            </View>
            <Text style={styles.heroTitle}>WisePath</Text>
            <Text style={styles.heroSubtitle}>
              Find your perfect program. Track your journey.
            </Text>
          </LinearGradient>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={1}>
          <FeatureCard
            icon={<Zap size={28} color={colors.primary} />}
            title="Smart Recommendations"
            description="AI-powered course matching from your assessment"
          />
        </AnimatedFadeIn>

        <AnimatedFadeIn index={2}>
          <FeatureCard
            icon={<Users size={28} color={colors.secondary} />}
            title="Progress Tracking"
            description="Monitor subjects, semesters, and graduation readiness"
          />
        </AnimatedFadeIn>

        <AnimatedFadeIn index={3}>
          <FeatureCard
            icon={<BookOpen size={28} color={colors.accent} />}
            title="Three Core Programs"
            description="Hospitality, IT, and Criminal Justice"
          />
        </AnimatedFadeIn>

        <AnimatedFadeIn index={4} style={styles.cta}>
          <PrimaryButton
            label="Sign In"
            onPress={() => navigation.navigate('Login')}
          />
          <PrimaryButton
            label="Create Student Account"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            style={{ marginTop: spacing.md }}
          />
        </AnimatedFadeIn>
      </ScrollView>
    </ScreenWrapper>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <View style={styles.featureCard}>
    <View style={styles.featureIcon}>{icon}</View>
    <View style={styles.featureBody}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  hero: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: typography.sizes.base,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#5B3EFE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureBody: { flex: 1 },
  featureTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  cta: { marginTop: spacing.lg },
});

export default StartScreen;
