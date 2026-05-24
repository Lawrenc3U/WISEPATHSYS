import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { AuthTextInput } from '../components/AuthTextInput';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { saveUserProfile } from '../services/authService';
import { ProfileSetupScreenProps } from '../navigation/types';

const LEARNING_STYLES = ['Visual', 'Hands-on', 'Reading', 'Mixed'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const EXPERIENCE = ['0-1 year', '1-3 years', '3+ years'];

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ navigation }) => {
  const account = useAuthStore((s) => s.account);
  const setUserProfile = useUserStore((s) => s.setUserProfile);
  const setAccount = useAuthStore((s) => s.setAccount);

  const [name, setName] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [currentSkills, setCurrentSkills] = useState(SKILL_LEVELS[0]);
  const [learningStyle, setLearningStyle] = useState(LEARNING_STYLES[3]);
  const [experience, setExperience] = useState(EXPERIENCE[0]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !learningGoals.trim()) {
      Alert.alert('Required', 'Please enter your name and learning goals.');
      return;
    }

    const profile = {
      name: name.trim(),
      email: account?.email,
      learningGoals: learningGoals.trim(),
      currentSkills,
      learningStyle,
      experience,
      quizHistory: [],
    };

    setLoading(true);
    try {
      if (account?.uid) {
        await saveUserProfile(account.uid, profile);
        setAccount({ ...account, profileComplete: true, profile });
      }
      setUserProfile(profile);
      navigation.replace('Dashboard');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Could not save profile.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const ChipRow = ({
    options,
    value,
    onChange,
  }: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <View style={styles.chipRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, value === opt && styles.chipSelected]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.chipText, value === opt && styles.chipTextSelected]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create your profile</Text>
        <Text style={styles.subtitle}>
          Tell us about yourself so we can personalize your course recommendations.
        </Text>

        <AuthTextInput label="Full name" value={name} onChangeText={setName} placeholder="Juan Dela Cruz" />
        <AuthTextInput
          label="Learning goals"
          value={learningGoals}
          onChangeText={setLearningGoals}
          placeholder="e.g. Find the right degree program for my career"
          multiline
          style={styles.textArea}
        />

        <Text style={styles.fieldLabel}>Current skill level</Text>
        <ChipRow options={SKILL_LEVELS} value={currentSkills} onChange={setCurrentSkills} />

        <Text style={styles.fieldLabel}>Preferred learning style</Text>
        <ChipRow options={LEARNING_STYLES} value={learningStyle} onChange={setLearningStyle} />

        <Text style={styles.fieldLabel}>Experience / time commitment</Text>
        <ChipRow options={EXPERIENCE} value={experience} onChange={setExperience} />

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.disabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? 'Saving...' : 'Continue to Dashboard'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
    lineHeight: 22,
  },
  fieldLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: '#F3EFFF' },
  chipText: { fontSize: typography.sizes.sm, color: colors.text },
  chipTextSelected: { color: colors.primary, fontWeight: typography.weights.bold },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  primaryBtnText: { color: colors.background, fontWeight: typography.weights.bold },
  disabled: { opacity: 0.6 },
});

export default ProfileSetupScreen;
