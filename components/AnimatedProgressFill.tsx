import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { colors } from '../utils/theme';

interface AnimatedProgressFillProps {
  value: number;
  color?: string;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

/** Static fill — Reanimated width animation disabled for Expo Go stability. */
export const AnimatedProgressFill: React.FC<AnimatedProgressFillProps> = ({
  value,
  color = colors.highlight,
  style,
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <View
      style={[
        { height: '100%', width: `${clampedValue}%`, backgroundColor: color },
        style,
      ]}
    />
  );
};
