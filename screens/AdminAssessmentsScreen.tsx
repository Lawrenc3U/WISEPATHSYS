import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { AdminAssessmentsScreenProps } from '../navigation/types';
import { QuizQuestion } from '../utils/types';
import {
  loadQuizQuestionsFromFirebase,
  saveQuizQuestion,
  deleteQuizQuestion,
} from '../services/adminService';
import { useCourseStore } from '../stores/courseStore';
import { Plus, Trash2 } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PrimaryButton } from '../components/PrimaryButton';

const AdminAssessmentsScreen: React.FC<AdminAssessmentsScreenProps> = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [editing, setEditing] = useState<QuizQuestion | null>(null);
  const [optionsText, setOptionsText] = useState('');
  const setQuizQuestions = useCourseStore((s) => s.setQuizQuestions);

  const load = async () => {
    const data = await loadQuizQuestionsFromFirebase();
    setQuestions(data);
    setQuizQuestions(data);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing({
      id: `q-${Date.now()}`,
      text: '',
      type: 'multipleChoice',
      options: ['Option A', 'Option B', 'Option C'],
    });
    setOptionsText('Option A\nOption B\nOption C');
  };

  const openEdit = (q: QuizQuestion) => {
    setEditing(q);
    setOptionsText((q.options || []).join('\n'));
  };

  const handleSave = async () => {
    if (!editing?.text.trim()) {
      Alert.alert('Required', 'Question text is required.');
      return;
    }
    const options = optionsText
      .split('\n')
      .map((o) => o.trim())
      .filter(Boolean);
    const question: QuizQuestion = {
      ...editing,
      options: options.length ? options : ['Yes', 'No'],
    };
    await saveQuizQuestion(question);
    setEditing(null);
    await load();
    Alert.alert('Saved', 'Assessment question updated.');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete question', 'Remove this question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteQuizQuestion(id);
          await load();
        },
      },
    ]);
  };

  const isNew =
    !!editing && !questions.some((question) => question.id === editing.id);

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
          <Text style={styles.eyebrow}>Assessment bank</Text>
          <Text style={styles.pageTitle}>Manage questions</Text>
          <Text style={styles.pageHint}>
            Keep career-assessment prompts clear and relevant.
          </Text>

          {editing ? (
            <View style={[styles.form, shadows.md]}>
              <Text style={styles.formTitle}>
                {isNew ? 'New question' : 'Edit question'}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Question text"
                placeholderTextColor={colors.textSecondary}
                value={editing.text}
                onChangeText={(t) => setEditing({ ...editing, text: t })}
                multiline
              />
              <Text style={styles.hint}>Options (one per line)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholderTextColor={colors.textSecondary}
                value={optionsText}
                onChangeText={setOptionsText}
                multiline
              />
              <View style={styles.formActions}>
                <PrimaryButton
                  label="Cancel"
                  onPress={() => setEditing(null)}
                  variant="outline"
                  style={styles.formButton}
                />
                <PrimaryButton
                  label="Save"
                  onPress={handleSave}
                  style={styles.formButton}
                />
              </View>
            </View>
          ) : (
            <PrimaryButton
              label="Add question"
              onPress={startNew}
              icon={<Plus size={20} color={colors.surfaceElevated} />}
              style={styles.addBtn}
            />
          )}

          {questions.length === 0 && !editing ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No questions yet</Text>
              <Text style={styles.emptyBody}>
                Tap Add question to build the assessment bank.
              </Text>
            </View>
          ) : (
            questions.map((q, index) => (
              <View key={q.id} style={[styles.card, shadows.sm]}>
                <Text style={styles.qNum}>Q{index + 1}</Text>
                <Text style={styles.qText}>{q.text}</Text>
                <Text style={styles.opts}>{q.options?.length || 0} options</Text>
                <View style={styles.row}>
                  <TouchableOpacity onPress={() => openEdit(q)}>
                    <Text style={styles.editLink}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(q.id)}>
                    <Trash2 size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing['3xl'] },
  eyebrow: {
    color: colors.highlight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  pageTitle: {
    color: colors.text,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
  },
  pageHint: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  addBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  emptyCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
  emptyBody: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  qNum: {
    fontSize: typography.sizes.xs,
    color: colors.highlight,
    fontWeight: typography.weights.bold,
  },
  qText: {
    fontWeight: typography.weights.semibold,
    marginTop: spacing.xs,
    color: colors.text,
  },
  opts: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  editLink: {
    color: colors.highlight,
    fontWeight: typography.weights.semibold,
  },
  form: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.highlight,
    backgroundColor: colors.surfaceElevated,
  },
  formTitle: {
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: typography.sizes.base,
  },
  hint: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    color: colors.text,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  formActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  formButton: { flex: 1 },
});

export default AdminAssessmentsScreen;
