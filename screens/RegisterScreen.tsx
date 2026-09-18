import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { wisepathLogo } from '../assets';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { AuthTextInput } from '../components/AuthTextInput';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { PrimaryButton } from '../components/PrimaryButton';
import { registerWithEmail, getFirebaseAuthErrorMessage } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { RegisterScreenProps } from '../navigation/types';
import { ErrorBanner } from '../components/ErrorBanner';

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAccount = useAuthStore((s) => s.setAccount);

  const handleRegister = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const account = await registerWithEmail(
        email.trim(),
        password,
        isAdmin ? 'admin' : 'student',
        adminCode
      );
      setAccount(account);
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AnimatedFadeIn index={0}>
            <View style={[styles.iconBadge, shadows.sm]}>
              <Image source={wisepathLogo} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.eyebrow}>Join WisePath</Text>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Register as a student or administrator
            </Text>
          </AnimatedFadeIn>

          <AnimatedFadeIn index={1}>
            <View style={[styles.formCard, shadows.sm]}>
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
                placeholder="At least 6 characters"
              />
              <AuthTextInput
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.roleToggle}
                onPress={() => setIsAdmin(!isAdmin)}
              >
                <View style={[styles.checkbox, isAdmin && styles.checkboxOn]} />
                <Text style={styles.roleText}>Register as administrator</Text>
              </TouchableOpacity>

              {isAdmin && (
                <AuthTextInput
                  label="Admin registration code"
                  value={adminCode}
                  onChangeText={setAdminCode}
                  secureTextEntry
                  placeholder="Enter admin code"
                />
              )}
            </View>
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
              label="Create Account"
              onPress={handleRegister}
              loading={loading}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={[styles.link, loading && { opacity: 0.4 }]}>
                Already have an account? <Text style={styles.linkBold}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </AnimatedFadeIn>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing['3xl'] },
  iconBadge: {
    width: 150,
    height: 150,
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
  eyebrow: {
    textAlign: 'center',
    color: colors.highlight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.35)',
  },
  roleToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
  },
  checkboxOn: {
    backgroundColor: colors.highlight,
    borderColor: colors.highlight,
  },
  roleText: { fontSize: typography.sizes.sm, color: colors.text },
  link: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  linkBold: { color: colors.highlight, fontWeight: typography.weights.bold },
});

export default RegisterScreen;
