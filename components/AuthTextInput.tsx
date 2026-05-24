import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

interface AuthTextInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const AuthTextInput: React.FC<AuthTextInputProps> = ({
  label,
  error,
  style,
  ...props
}) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError, style]}
      placeholderTextColor={colors.textSecondary}
      autoCapitalize="none"
      {...props}
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.xs,
    color: colors.error,
  },
});
