import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { StartScreenProps } from '../navigation/types';
import { Zap, BookOpen, Users } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { PrimaryButton } from '../components/PrimaryButton';

const wisepathLogo = require('../assets/wisepath.jpg');

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  return (
    <ScreenWrapper gradient>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedFadeIn index={0}>
          <LinearGradient
            colors={[colors.highlight, '#5B97B8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.logoRing}>
              <Image source={wisepathLogo} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.heroTitle}>WisePath</Text>
            <Text style={styles.heroSubtitle}>
              Find your perfect program. Track your journey.
            </Text>
          </LinearGradient>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={1}>
          <FeatureCard
            icon={<Zap size={28} color={colors.highlight} />}
            title="Smart Recommendations"
            description="AI-powered course matching from your assessment"
          />
        </AnimatedFadeIn>

        <AnimatedFadeIn index={2}>
          <FeatureCard
            icon={<Users size={28} color={colors.highlight} />}
            title="Progress Tracking"
            description="Monitor subjects, semesters, and graduation readiness"
          />
        </AnimatedFadeIn>

        <AnimatedFadeIn index={3}>
          <FeatureCard
            icon={<BookOpen size={28} color={colors.highlight} />}
            title="21 Undergraduate Programs"
            description="Explore technology, business, engineering, education, and more"
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
  <View style={[styles.featureCard, shadows.sm]}>
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
  logoImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
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
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlightSoft,
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
