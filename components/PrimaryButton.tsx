import React from 'react';
import {
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { PressableScale } from './PressableScale';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
}) => {
  const isDisabled = disabled || loading;

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'outline' ? colors.highlight : colors.surfaceElevated
          }
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              variant === 'outline' && styles.labelOutline,
              variant === 'secondary' && styles.labelSecondary,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </>
      )}
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: colors.highlight,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.highlight,
  },
  label: {
    color: colors.surfaceElevated,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
  labelOutline: { color: colors.highlight },
  labelSecondary: { color: colors.text },
});
