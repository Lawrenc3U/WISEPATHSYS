import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, typography } from '../utils/theme';
import { AuthTextInput } from '../components/AuthTextInput';
import { loginWithEmail, getFirebaseAuthErrorMessage } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { loadUserAssessments } from '../services/userDataService';
import { loadAllCourseProgress, loadCourseProgress } from '../services/progressService';
import { LoginScreenProps } from '../navigation/types';
import { BookOpen } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { PrimaryButton } from '../components/PrimaryButton';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAccount = useAuthStore((s) => s.setAccount);
  const hydrateFromAccount = useUserStore((s) => s.hydrateFromAccount);
  const setProgressByCourse = useUserStore((s) => s.setProgressByCourse);
  const setStudentProgress = useUserStore((s) => s.setStudentProgress);
  const setSelectedCourseId = useUserStore((s) => s.setSelectedCourseId);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter email and password.');
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

      if (account.role === 'admin') {
        navigation.replace('AdminDashboard');
      } else if (!account.profileComplete) {
        navigation.replace('ProfileSetup');
      } else {
        navigation.replace('Dashboard');
      }
    } catch (error: unknown) {
      Alert.alert('Login failed', getFirebaseAuthErrorMessage(error));
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
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <AnimatedFadeIn index={0}>
            <View style={styles.logo}>
              <BookOpen size={40} color={colors.primary} />
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
            <PrimaryButton
              label="Sign In"
              onPress={handleLogin}
              loading={loading}
            />
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>
                New student? <Text style={styles.linkBold}>Create account</Text>
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
  content: { padding: spacing.xl, paddingTop: spacing['2xl'] },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  link: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  linkBold: { color: colors.primary, fontWeight: typography.weights.bold },
});

export default LoginScreen;
