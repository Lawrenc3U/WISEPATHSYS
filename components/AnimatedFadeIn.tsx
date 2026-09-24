import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';

interface AnimatedFadeInProps {
  children: React.ReactNode;
  delay?: number;
  index?: number;
  style?: StyleProp<ViewStyle>;
  from?: 'down' | 'fade';
  onLayout?: (event: LayoutChangeEvent) => void;
}

/**
 * Passthrough wrapper. Reanimated `entering` animations were leaving views
 * at opacity 0 on Expo SDK 57 / Reanimated 4 in Expo Go.
 * Keep the API so call sites don't change; motion can be restored later.
 */
export const AnimatedFadeIn: React.FC<AnimatedFadeInProps> = ({
  children,
  style,
  onLayout,
}) => {
  return (
    <View style={style} onLayout={onLayout}>
      {children}
    </View>
  );
};
