import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { colors, spacing } from '../utils/theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'large',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={size}
        color={colors.primary}
        style={styles.spinner}
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  spinner: {
    marginBottom: spacing.lg,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
