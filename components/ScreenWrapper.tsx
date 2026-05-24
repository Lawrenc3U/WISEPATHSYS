import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  gradient?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  gradient = false,
  style,
}) => {
  if (gradient) {
    return (
      <LinearGradient
        colors={['#F8F6FF', '#FFFFFF', '#FFF5FA']}
        style={[styles.flex, style]}
      >
        <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={[styles.container, style]} edges={['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
});
