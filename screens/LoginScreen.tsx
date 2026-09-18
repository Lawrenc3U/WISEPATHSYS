import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { wisepathLogo } from '../assets';
import { colors, spacing, typography, shadows } from '../utils/theme';
import { AuthTextInput } from '../components/AuthTextInput';
import { loginWithEmail, getFirebaseAuthErrorMessage } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { loadUserAssessments } from '../services/userDataService';
import { loadAllCourseProgress, loadCourseProgress } from '../services/progressService';
import { LoginScreenProps } from '../navigation/types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { PrimaryButton } from '../components/PrimaryButton';
import { ErrorBanner } from '../components/ErrorBanner';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAccount = useAuthStore((s) => s.setAccount);
  const hydrateFromAccount = useUserStore((s) => s.hydrateFromAccount);
  const setProgressByCourse = useUserStore((s) => s.setProgressByCourse);
  const setStudentProgress = useUserStore((s) => s.setStudentProgress);
  const setSelectedCourseId = useUserStore((s) => s.setSelectedCourseId);

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { account } = await loginWithEmail(email.trim(), password);
      setAccount(account);

      const history = await loadUserAssessments(account.uid);
      const progressMap = await loadAllCourseProgress(account.uid);
      setProgressByCourse(progressMap);

      if (account.profile) {
        hydrateFromAccount(account.profile, history);
      }

      const activeCourseId =
        account.profile?.selectedPath?.courses[0]?.id ||
        Object.keys(progressMap)[0] ||
        null;

      if (activeCourseId) {
        setSelectedCourseId(activeCourseId);
        const activeProgress =
          progressMap[activeCourseId] ||
          (await loadCourseProgress(account.uid, activeCourseId));
        if (activeProgress) {
          setStudentProgress(activeProgress);
        }
      }

      // RootNavigator switches to AppNavigator when account is set
    } catch (err: unknown) {
      setError(getFirebaseAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper gradient>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inner}>
          <AnimatedFadeIn index={0}>
            <View style={[styles.logo, shadows.sm]}>
              <Image source={wisepathLogo} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue your WisePath journey</Text>
          </AnimatedFadeIn>

          <AnimatedFadeIn index={1}>
            <AuthTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="you@school.edu"
            />
            <AuthTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
            />
          </AnimatedFadeIn>

          <AnimatedFadeIn index={2}>
            {error && (
              <ErrorBanner
                message={error}
                type="error"
                onDismiss={() => setError(null)}
              />
            )}
            <PrimaryButton
              label="Sign In"
              onPress={handleLogin}
              loading={loading}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={loading}
            >
              <Text style={[styles.link, loading && styles.linkDisabled]}>
                New student? <Text style={styles.linkBold}>Create account</Text>
              </Text>
            </TouchableOpacity>
          </AnimatedFadeIn>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoImage: { width: '100%', height: '100%' },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  link: {
    textAlign: 'center',
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  linkDisabled: { opacity: 0.4 },
  linkBold: { color: colors.highlight, fontWeight: typography.weights.bold },
});

export default LoginScreen;
