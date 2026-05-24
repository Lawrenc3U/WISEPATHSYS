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
import { AdminCoursesScreenProps } from '../navigation/types';
import { Course } from '../utils/types';
import { getManagedCourses, saveCourse, deleteCourse } from '../services/adminService';
import { useCourseStore } from '../stores/courseStore';
import { Plus, Trash2 } from 'lucide-react-native';

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setEditing(emptyCourse())}>
          <Plus size={20} color={colors.background} />
          <Text style={styles.addBtnText}>Add Course</Text>
        </TouchableOpacity>

        {courses.map((course) => (
          <View key={course.id} style={styles.card}>
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
          <View style={styles.form}>
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
    backgroundColor: colors.primary,
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
  cardTitle: { fontWeight: typography.weights.bold, fontSize: typography.sizes.lg },
  cardDesc: { color: colors.textSecondary, marginTop: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  editLink: { color: colors.primary, fontWeight: typography.weights.semibold },
  form: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#FAFAFF',
  },
  formTitle: { fontWeight: typography.weights.bold, marginBottom: spacing.md },
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
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  saveBtnText: { color: colors.background, fontWeight: typography.weights.bold },
});

export default AdminCoursesScreen;
