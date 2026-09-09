import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AnimatedFadeInProps {
  children: React.ReactNode;
  delay?: number;
  index?: number;
  style?: StyleProp<ViewStyle>;
  from?: 'down' | 'fade';
}

export const AnimatedFadeIn: React.FC<AnimatedFadeInProps> = ({
  children,
  delay = 0,
  index = 0,
  style,
  from = 'down',
}) => {
  const reduceMotion = useReducedMotion();
  const totalDelay = delay + Math.min(index, 5) * 70;
  const entering =
    from === 'fade'
      ? FadeIn.delay(totalDelay).duration(450)
      : FadeInDown.delay(totalDelay).duration(500).springify().damping(18);

  return (
    <Animated.View entering={reduceMotion ? undefined : entering} style={style}>
      {children}
    </Animated.View>
  );
};
