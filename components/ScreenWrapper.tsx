import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { DecorativeBlobs } from './sprites';

interface ScreenWrapperProps {
  children: React.ReactNode;
  gradient?: boolean;
  decorations?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  gradient = false,
  decorations = false,
  style,
}) => {
  if (gradient) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.surface, colors.gradientEnd]}
        style={[styles.flex, style]}
      >
        {decorations ? <DecorativeBlobs /> : null}
        <SafeAreaView style={styles.content} edges={['top', 'left', 'right', 'bottom']}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={[styles.container, style]} edges={['top', 'left', 'right', 'bottom']}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, zIndex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
});
