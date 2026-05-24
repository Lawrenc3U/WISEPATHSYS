import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { AuthTextInput } from '../components/AuthTextInput';
import { registerWithEmail, getFirebaseAuthErrorMessage } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { RegisterScreenProps } from '../navigation/types';

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const setAccount = useAuthStore((s) => s.setAccount);

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
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

      if (account.role === 'admin') {
        navigation.replace('AdminDashboard');
      } else {
        navigation.replace('ProfileSetup');
      }
    } catch (error: unknown) {
      Alert.alert('Registration failed', getFirebaseAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Register as a student or administrator
          </Text>

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

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.disabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.primaryBtnText}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>
              Already have an account? <Text style={styles.linkBold}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.xl },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
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
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleText: { fontSize: typography.sizes.sm, color: colors.text },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  primaryBtnText: {
    color: colors.background,
    fontWeight: typography.weights.bold,
  },
  disabled: { opacity: 0.6 },
  link: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  linkBold: { color: colors.primary, fontWeight: typography.weights.bold },
});

export default RegisterScreen;
