import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { AdminCoursesScreenProps } from '../navigation/types';
import { Course } from '../utils/types';
import { getManagedCourses, saveCourse, deleteCourse } from '../services/adminService';
import { useCourseStore } from '../stores/courseStore';
import { Plus, Trash2 } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PrimaryButton } from '../components/PrimaryButton';

const emptyCourse = (): Course => ({
  id: `course-${Date.now()}`,
  title: '',
  description: '',
  difficulty: 'beginner',
  duration: '4 years',
  skills: [],
  careerPaths: [],
  curriculum: [],
});

const AdminCoursesScreen: React.FC<AdminCoursesScreenProps> = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const setAllCourses = useCourseStore((s) => s.setAllCourses);

  const load = async () => {
    const data = await getManagedCourses();
    setCourses(data);
    setAllCourses(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing?.title.trim()) {
      Alert.alert('Required', 'Course title is required.');
      return;
    }
    await saveCourse({
      ...editing,
      skills: editing.skills.length ? editing.skills : ['General'],
      careerPaths: editing.careerPaths.length ? editing.careerPaths : ['Various'],
      curriculum: editing.curriculum.length ? editing.curriculum : ['Core subjects'],
    });
    setEditing(null);
    await load();
    Alert.alert('Saved', 'Course updated successfully.');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete course', 'Remove this course?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCourse(id);
          await load();
        },
      },
    ]);
  };

  return (
    <ScreenWrapper gradient>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>Program catalog</Text>
        <Text style={styles.pageTitle}>Manage courses</Text>
        <Text style={styles.pageHint}>Add or update programs available to students.</Text>
        <PrimaryButton
          label="Add Course"
          onPress={() => setEditing(emptyCourse())}
          icon={<Plus size={20} color="#FFFFFF" />}
          style={styles.addBtn}
        />

        {courses.map((course) => (
          <View key={course.id} style={[styles.card, shadows.sm]}>
            <Text style={styles.cardTitle}>{course.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{course.description}</Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => setEditing(course)}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(course.id)}>
                <Trash2 size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {editing && (
          <View style={[styles.form, shadows.md]}>
            <Text style={styles.formTitle}>
              {courses.find((c) => c.id === editing.id) ? 'Edit Course' : 'New Course'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editing.title}
              onChangeText={(t) => setEditing({ ...editing, title: t })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={editing.description}
              onChangeText={(t) => setEditing({ ...editing, description: t })}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Duration (e.g. 4 years)"
              value={editing.duration}
              onChangeText={(t) => setEditing({ ...editing, duration: t })}
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
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
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
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontWeight: typography.weights.bold, fontSize: typography.sizes.lg },
  cardDesc: { color: colors.textSecondary, marginTop: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  editLink: { color: colors.highlight, fontWeight: typography.weights.semibold },
  form: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.highlight,
    backgroundColor: colors.surfaceElevated,
  },
  formTitle: { fontWeight: typography.weights.bold, marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceElevated,
  },
  textArea: { minHeight: 80 },
  formActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  formButton: {
    flex: 1,
  },
});

export default AdminCoursesScreen;
