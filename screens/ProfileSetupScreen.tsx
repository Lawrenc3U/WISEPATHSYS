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

const MultiChipRow = ({
  options,
  values,
  onToggle,
}: {
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) => (
  <View style={styles.chipRow}>
    {options.map((opt) => {
      const selected = values.includes(opt);
      return (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected && styles.chipSelected]}
          onPress={() => onToggle(opt)}
        >
          <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
            {opt}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ navigation }) => {
  const account = useAuthStore((s) => s.account);
  const setUserProfile = useUserStore((s) => s.setUserProfile);
  const setAccount = useAuthStore((s) => s.setAccount);

  const [name, setName] = useState('');
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [currentSkills, setCurrentSkills] = useState(SKILL_LEVELS[0]);
  const [learningStyle, setLearningStyle] = useState(LEARNING_STYLES[3]);
  const [experience, setExperience] = useState(EXPERIENCE[0]);

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
      return;
    }

    const profile = {
      name: name.trim(),
      email: account?.email,
      learningGoals,
      currentSkills,
      learningStyle,
      experience,
      studentStatus,
      shsStrand,
      seniorHighStrand: shsStrand,
      academicAverage: academicAverage.trim() || undefined,
      residenceType,
      parentalIncomeLevel,
      careerInterests,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create your profile</Text>
        <Text style={styles.subtitle}>
          Tell us about yourself so we can personalize your course recommendations.
        </Text>

        <AuthTextInput
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Juan Dela Cruz"
        />

        <Text style={styles.sectionHeader}>Student status</Text>
        <ChipRow
          options={STUDENT_STATUS_OPTIONS.map((o) => o.label)}
          value={
            STUDENT_STATUS_OPTIONS.find((o) => o.value === studentStatus)?.label ||
            STUDENT_STATUS_OPTIONS[0].label
          }
          onChange={(label) => {
            const match = STUDENT_STATUS_OPTIONS.find((o) => o.label === label);
            if (match) setStudentStatus(match.value);
          }}
        />

        <Text style={styles.sectionHeader}>SHS strand</Text>
        <ChipRow options={[...SHS_STRANDS]} value={shsStrand} onChange={setShsStrand} />

        <AuthTextInput
          label="Academic average (optional)"
          value={academicAverage}
          onChangeText={setAcademicAverage}
          placeholder="e.g. 88 or 1.75"
        />

        <Text style={styles.sectionHeader}>Residence</Text>
        <ChipRow
          options={RESIDENCE_TYPE_OPTIONS.map((o) => o.label)}
          value={
            RESIDENCE_TYPE_OPTIONS.find((o) => o.value === residenceType)?.label ||
            RESIDENCE_TYPE_OPTIONS[0].label
          }
          onChange={(label) => {
            const match = RESIDENCE_TYPE_OPTIONS.find((o) => o.label === label);
            if (match) setResidenceType(match.value);
          }}
        />

        <Text style={styles.sectionHeader}>Parental income (optional)</Text>
        <ChipRow
          options={PARENTAL_INCOME_OPTIONS.map((o) => o.label)}
          value={
            PARENTAL_INCOME_OPTIONS.find((o) => o.value === parentalIncomeLevel)
              ?.label || PARENTAL_INCOME_OPTIONS[PARENTAL_INCOME_OPTIONS.length - 1].label
          }
          onChange={(label) => {
            const match = PARENTAL_INCOME_OPTIONS.find((o) => o.label === label);
            if (match) setParentalIncomeLevel(match.value);
          }}
        />

        <Text style={styles.sectionHeader}>Career interests</Text>
        <Text style={styles.fieldLabel}>Select all that apply</Text>
        <MultiChipRow
          options={CAREER_INTEREST_OPTIONS}
          values={careerInterests}
          onToggle={toggleCareerInterest}
        />

        <Text style={styles.sectionHeader}>Learning goals</Text>
        <Text style={styles.fieldLabel}>What do you hope to achieve? (select all that apply)</Text>
        <MultiChipRow
          options={LEARNING_GOALS_OPTIONS}
          values={learningGoals}
          onToggle={toggleLearningGoal}
        />

        <Text style={styles.sectionHeader}>Skill level</Text>
        <ChipRow options={SKILL_LEVELS} value={currentSkills} onChange={setCurrentSkills} />

        <Text style={styles.sectionHeader}>Learning style</Text>
        <ChipRow options={LEARNING_STYLES} value={learningStyle} onChange={setLearningStyle} />

        <Text style={styles.sectionHeader}>Experience</Text>
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
  content: { padding: spacing.xl, paddingBottom: spacing['2xl'] },
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
  sectionHeader: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
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
