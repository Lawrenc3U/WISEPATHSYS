import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

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
  const totalDelay = delay + index * 70;
  const entering =
    from === 'fade'
      ? FadeIn.delay(totalDelay).duration(450)
      : FadeInDown.delay(totalDelay).duration(500).springify().damping(18);

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
};
