import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../utils/theme';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AnimatedProgressFillProps {
  value: number;
  color?: string;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export const AnimatedProgressFill: React.FC<AnimatedProgressFillProps> = ({
  value,
  color = colors.highlight,
  duration = 650,
  delay = 0,
  style,
}) => {
  const progress = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  const clampedValue = Math.max(0, Math.min(100, value));

  useEffect(() => {
    if (reduceMotion) {
      progress.value = clampedValue;
      return;
    }

    const timer = setTimeout(() => {
      progress.value = withTiming(clampedValue, { duration });
    }, delay);
    return () => clearTimeout(timer);
  }, [clampedValue, delay, duration, progress, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <Animated.View
      style={[{ height: '100%', backgroundColor: color }, style, animatedStyle]}
    />
  );
};
