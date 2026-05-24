import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { AdminAssessmentsScreenProps } from '../navigation/types';
import { QuizQuestion } from '../utils/types';
import {
  loadQuizQuestionsFromFirebase,
  saveQuizQuestion,
  deleteQuizQuestion,
} from '../services/adminService';
import { useCourseStore } from '../stores/courseStore';
import { Plus, Trash2 } from 'lucide-react-native';

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.addBtn} onPress={startNew}>
          <Plus size={20} color={colors.background} />
          <Text style={styles.addBtnText}>Add Question</Text>
        </TouchableOpacity>

        {questions.map((q, index) => (
          <View key={q.id} style={styles.card}>
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
        ))}

        {editing && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Edit Question</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Question text"
              value={editing.text}
              onChangeText={(t) => setEditing({ ...editing, text: t })}
              multiline
            />
            <Text style={styles.hint}>Options (one per line)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={optionsText}
              onChangeText={setOptionsText}
              multiline
            />
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(null)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  addBtnText: { color: colors.background, fontWeight: typography.weights.bold },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qNum: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: typography.weights.bold },
  qText: { fontWeight: typography.weights.semibold, marginTop: spacing.xs },
  opts: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  editLink: { color: colors.primary, fontWeight: typography.weights.semibold },
  form: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  formTitle: { fontWeight: typography.weights.bold, marginBottom: spacing.md },
  hint: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  textArea: { minHeight: 80 },
  formActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  cancelBtn: { flex: 1, padding: spacing.md, alignItems: 'center' },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  saveBtnText: { color: colors.background, fontWeight: typography.weights.bold },
});

export default AdminAssessmentsScreen;
