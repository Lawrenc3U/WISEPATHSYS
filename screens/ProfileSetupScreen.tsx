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
<<<<<<< HEAD
import { SENIOR_HIGH_STRANDS } from '../utils/constants';
=======
import {
  STUDENT_STATUS_OPTIONS,
  SHS_STRANDS,
  RESIDENCE_TYPE_OPTIONS,
  PARENTAL_INCOME_OPTIONS,
  CAREER_INTEREST_OPTIONS,
  LEARNING_GOALS_OPTIONS,
} from '../utils/constants';
import { StudentStatus, ResidenceType, ParentalIncomeLevel } from '../utils/types';

const LEARNING_STYLES = ['Visual', 'Hands-on', 'Reading', 'Mixed'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const EXPERIENCE = ['0-1 year', '1-3 years', '3+ years'];
>>>>>>> 5f9ea0b26c12317ca925171c136617506373f5cf

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ navigation }) => {
  const account = useAuthStore((s) => s.account);
  const setUserProfile = useUserStore((s) => s.setUserProfile);
  const setAccount = useAuthStore((s) => s.setAccount);

  const [name, setName] = useState('');
<<<<<<< HEAD
  const [seniorHighStrand, setSeniorHighStrand] = useState<string>(
    SENIOR_HIGH_STRANDS[0]
  );
  const [learningGoals, setLearningGoals] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !learningGoals.trim() || !seniorHighStrand) {
      Alert.alert(
        'Required',
        'Please enter your name, senior high strand, and learning goals.'
      );
=======
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [currentSkills, setCurrentSkills] = useState(SKILL_LEVELS[0]);
  const [learningStyle, setLearningStyle] = useState(LEARNING_STYLES[3]);
  const [experience, setExperience] = useState(EXPERIENCE[0]);

  // Panel-required background/academic fields
  const [studentStatus, setStudentStatus] = useState<StudentStatus>('incoming');
  const [shsStrand, setShsStrand] = useState(SHS_STRANDS[0]);
  const [academicAverage, setAcademicAverage] = useState('');
  const [residenceType, setResidenceType] = useState<ResidenceType>('urban');
  const [parentalIncomeLevel, setParentalIncomeLevel] =
    useState<ParentalIncomeLevel>('prefer_not_to_say');
  const [careerInterests, setCareerInterests] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const toggleCareerInterest = (interest: string) => {
    setCareerInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleLearningGoal = (goal: string) => {
    setLearningGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }
    if (learningGoals.length === 0) {
      Alert.alert('Required', 'Please select at least one learning goal.');
      return;
    }
    if (careerInterests.length === 0) {
      Alert.alert('Required', 'Please select at least one career interest area.');
>>>>>>> 5f9ea0b26c12317ca925171c136617506373f5cf
      return;
    }

    const profile = {
      name: name.trim(),
      email: account?.email,
<<<<<<< HEAD
      seniorHighStrand,
      learningGoals: learningGoals.trim(),
=======
      learningGoals,
      currentSkills,
      learningStyle,
      experience,
>>>>>>> 5f9ea0b26c12317ca925171c136617506373f5cf
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

<<<<<<< HEAD
        <Text style={styles.fieldLabel}>Senior high strand</Text>
        <Text style={styles.fieldHint}>
          Your SHS track helps us align course suggestions with your background.
        </Text>
        <ChipRow
          options={[...SENIOR_HIGH_STRANDS]}
          value={seniorHighStrand}
          onChange={setSeniorHighStrand}
        />

        <AuthTextInput
          label="Learning goals"
          value={learningGoals}
          onChangeText={setLearningGoals}
          placeholder="e.g. Find the right degree program for my career"
          multiline
          style={styles.textArea}
=======
        <Text style={styles.sectionHeader}>Learning goals</Text>
        <Text style={styles.fieldLabel}>What do you hope to achieve? (select all that apply)</Text>
        <MultiChipRow
          options={LEARNING_GOALS_OPTIONS}
          values={learningGoals}
          onToggle={toggleLearningGoal}
>>>>>>> 5f9ea0b26c12317ca925171c136617506373f5cf
        />

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
  fieldHint: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 18,
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
  chipSelected: { borderColor: colors.accent, backgroundColor: colors.primary },
  chipText: { fontSize: typography.sizes.sm, color: colors.text },
  chipTextSelected: { color: colors.text, fontWeight: typography.weights.bold },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  primaryBtnText: { color: colors.text, fontWeight: typography.weights.bold },
  disabled: { opacity: 0.6 },
});

export default ProfileSetupScreen;
