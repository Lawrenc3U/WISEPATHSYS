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
import { Check } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { AuthTextInput } from '../components/AuthTextInput';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { saveUserProfile } from '../services/authService';
import { ProfileSetupScreenProps } from '../navigation/types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AnimatedFadeIn } from '../components/AnimatedFadeIn';
import { PrimaryButton } from '../components/PrimaryButton';
import { StudentGuide } from '../components/sprites';
import {
  STUDENT_STATUS_OPTIONS,
  SHS_STRANDS,
  RESIDENCE_TYPE_OPTIONS,
  PARENTAL_INCOME_OPTIONS,
  CAREER_INTEREST_OPTIONS,
  LEARNING_GOALS_OPTIONS,
} from '../utils/constants';
import {
  StudentStatus,
  ResidenceType,
  ParentalIncomeLevel,
  UserProfile,
} from '../utils/types';

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
    {options.map((opt) => {
      const selected = value === opt;
      return (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected && styles.chipSelected]}
          onPress={() => onChange(opt)}
          activeOpacity={0.75}
        >
          {selected ? (
            <Check size={14} color="#FFFFFF" strokeWidth={3} />
          ) : null}
          <Text
            style={[styles.chipText, selected && styles.chipTextSelected]}
            numberOfLines={2}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      );
    })}
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
          activeOpacity={0.75}
        >
          {selected ? (
            <Check size={14} color="#FFFFFF" strokeWidth={3} />
          ) : null}
          <Text
            style={[styles.chipText, selected && styles.chipTextSelected]}
            numberOfLines={2}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const SectionCard = ({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <View style={[styles.card, shadows.sm]}>
    <Text style={styles.cardTitle}>{title}</Text>
    {hint ? <Text style={styles.cardHint}>{hint}</Text> : null}
    {children}
  </View>
);

const FieldBlock = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <View style={styles.fieldBlock}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
  </View>
);

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  navigation,
  route,
}) => {
  const account = useAuthStore((s) => s.account);
  const setUserProfile = useUserStore((s) => s.setUserProfile);
  const userProfile = useUserStore((s) => s.userProfile);
  const setAccount = useAuthStore((s) => s.setAccount);
  const isEditing = route.params?.mode === 'edit';

  const [name, setName] = useState(userProfile?.name || '');
  const [learningGoals, setLearningGoals] = useState<string[]>(
    userProfile?.learningGoals || []
  );
  const [currentSkills, setCurrentSkills] = useState(
    userProfile?.currentSkills || SKILL_LEVELS[0]
  );
  const [learningStyle, setLearningStyle] = useState(
    userProfile?.learningStyle || LEARNING_STYLES[3]
  );
  const [experience, setExperience] = useState(
    userProfile?.experience || EXPERIENCE[0]
  );

  const [studentStatus, setStudentStatus] = useState<StudentStatus>(
    userProfile?.studentStatus || 'incoming'
  );
  const [shsStrand, setShsStrand] = useState(
    userProfile?.shsStrand ||
      userProfile?.seniorHighStrand ||
      SHS_STRANDS[0]
  );
  const [academicAverage, setAcademicAverage] = useState(
    userProfile?.academicAverage || ''
  );
  const [residenceType, setResidenceType] = useState<ResidenceType>(
    userProfile?.residenceType || 'urban'
  );
  const [parentalIncomeLevel, setParentalIncomeLevel] =
    useState<ParentalIncomeLevel>(
      userProfile?.parentalIncomeLevel || 'prefer_not_to_say'
    );
  const [careerInterests, setCareerInterests] = useState<string[]>(
    userProfile?.careerInterests || []
  );

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

    const profile: UserProfile = {
      ...userProfile,
      name: name.trim(),
      email: account?.email || userProfile?.email,
      learningGoals,
      currentSkills,
      learningStyle,
      experience,
      studentStatus,
      shsStrand,
      seniorHighStrand: shsStrand,
      academicAverage: academicAverage.trim(),
      residenceType,
      parentalIncomeLevel,
      careerInterests,
      quizHistory: userProfile?.quizHistory || [],
    };

    setLoading(true);
    try {
      if (account?.uid) {
        await saveUserProfile(account.uid, profile);
        setAccount({ ...account, profileComplete: true, profile });
      }
      setUserProfile(profile);
      if (isEditing) {
        navigation.goBack();
      } else {
        navigation.replace('AssessmentQuiz');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Could not save profile.';
      Alert.alert('Error', message);
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
          showsVerticalScrollIndicator={false}
        >
          <AnimatedFadeIn index={0} style={styles.header}>
            <StudentGuide size={88} />
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>
                {isEditing ? 'Keep your guidance accurate' : 'Welcome to WisePath'}
              </Text>
              <Text style={styles.title}>
                {isEditing ? 'Edit your profile' : 'Create your profile'}
              </Text>
              <Text style={styles.subtitle}>
                {isEditing
                  ? 'Update the information used for your program recommendations.'
                  : 'Tell us about yourself, then take a short assessment. Together they rank your top 3 program matches.'}
              </Text>
            </View>
          </AnimatedFadeIn>

          <SectionCard title="About you">
            <AuthTextInput
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="Juan Dela Cruz"
              autoCapitalize="words"
            />

            <FieldBlock label="Student status">
              <ChipRow
                options={STUDENT_STATUS_OPTIONS.map((o) => o.label)}
                value={
                  STUDENT_STATUS_OPTIONS.find((o) => o.value === studentStatus)
                    ?.label || STUDENT_STATUS_OPTIONS[0].label
                }
                onChange={(label) => {
                  const match = STUDENT_STATUS_OPTIONS.find((o) => o.label === label);
                  if (match) setStudentStatus(match.value);
                }}
              />
            </FieldBlock>

            <FieldBlock label="SHS strand">
              <ChipRow
                options={[...SHS_STRANDS]}
                value={shsStrand}
                onChange={setShsStrand}
              />
            </FieldBlock>

            <AuthTextInput
              label="Academic average (optional)"
              value={academicAverage}
              onChangeText={setAcademicAverage}
              placeholder="e.g. 88 or 1.75"
              keyboardType="decimal-pad"
            />
          </SectionCard>

          <SectionCard title="Background" hint="Used only to personalize guidance">
            <FieldBlock label="Residence">
              <ChipRow
                options={RESIDENCE_TYPE_OPTIONS.map((o) => o.label)}
                value={
                  RESIDENCE_TYPE_OPTIONS.find((o) => o.value === residenceType)
                    ?.label || RESIDENCE_TYPE_OPTIONS[0].label
                }
                onChange={(label) => {
                  const match = RESIDENCE_TYPE_OPTIONS.find((o) => o.label === label);
                  if (match) setResidenceType(match.value);
                }}
              />
            </FieldBlock>

            <FieldBlock label="Parental income (optional)">
              <ChipRow
                options={PARENTAL_INCOME_OPTIONS.map((o) => o.label)}
                value={
                  PARENTAL_INCOME_OPTIONS.find((o) => o.value === parentalIncomeLevel)
                    ?.label ||
                  PARENTAL_INCOME_OPTIONS[PARENTAL_INCOME_OPTIONS.length - 1].label
                }
                onChange={(label) => {
                  const match = PARENTAL_INCOME_OPTIONS.find((o) => o.label === label);
                  if (match) setParentalIncomeLevel(match.value);
                }}
              />
            </FieldBlock>
          </SectionCard>

          <SectionCard
            title="Career interests"
            hint={`${careerInterests.length} selected · pick at least one`}
          >
            <MultiChipRow
              options={CAREER_INTEREST_OPTIONS}
              values={careerInterests}
              onToggle={toggleCareerInterest}
            />
          </SectionCard>

          <SectionCard
            title="Learning goals"
            hint={`${learningGoals.length} selected · pick at least one`}
          >
            <MultiChipRow
              options={LEARNING_GOALS_OPTIONS}
              values={learningGoals}
              onToggle={toggleLearningGoal}
            />
          </SectionCard>

          <SectionCard title="Learning preferences">
            <FieldBlock label="Skill level">
              <ChipRow
                options={SKILL_LEVELS}
                value={currentSkills}
                onChange={setCurrentSkills}
              />
            </FieldBlock>

            <FieldBlock label="Learning style">
              <ChipRow
                options={LEARNING_STYLES}
                value={learningStyle}
                onChange={setLearningStyle}
              />
            </FieldBlock>

            <FieldBlock label="Experience">
              <ChipRow
                options={EXPERIENCE}
                value={experience}
                onChange={setExperience}
              />
            </FieldBlock>
          </SectionCard>

          <PrimaryButton
            label={isEditing ? 'Save Changes' : 'Take Assessment'}
            onPress={handleSave}
            loading={loading}
            style={styles.cta}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.highlight,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(149, 189, 215, 0.35)',
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardHint: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  fieldBlock: {
    marginBottom: spacing.md,
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
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.highlightSoft,
    maxWidth: '100%',
  },
  chipSelected: {
    backgroundColor: colors.highlight,
    borderColor: colors.highlight,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
    flexShrink: 1,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
  cta: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
});

export default ProfileSetupScreen;
