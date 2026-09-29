import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface PressableScaleProps extends Omit<TouchableOpacityProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Kept for API compatibility; press feedback uses opacity. */
  pressedScale?: number;
}

/**
 * Shared pressable used by buttons and cards.
 * Uses TouchableOpacity so flex layouts (flex:1 footers, full-width CTAs)
 * expand correctly — Pressable style callbacks were collapsing button frames.
 */
export const PressableScale: React.FC<PressableScaleProps> = ({
  children,
  style,
  pressedScale: _pressedScale,
  activeOpacity = 0.85,
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={[style, disabled ? { opacity: 0.45 } : null]}
    >
      {children}
    </TouchableOpacity>
  );
};
