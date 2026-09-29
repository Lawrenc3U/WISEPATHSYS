import { StyleSheet } from 'react-native';

export const colors = {
  // Page canvas (was sky blue) → warm parchment
  primary: '#FFFDF8',
  primaryLight: '#FFFFFF',
  // Second gradient stop (was butter) → deeper parchment
  secondary: '#F6F1E6',
  // Secondary accent (was pale blue) → route teal
  accent: '#3E7A6C',
  /** Primary accent: buttons, the match ring, "this is the top pick" (was blue) → compass gold */
  highlight: '#C2872E',
  highlightSoft: '#F3E4C4',
  background: '#FFFDF8',
  surface: '#F6F1E6',
  surfaceElevated: '#FFFFFF',
  // Ink navy instead of neutral gray-black
  text: '#1F3350',
  textSecondary: '#5B6E85',
  border: '#3E7A6C',
  success: '#10B981',
  // Rust instead of stock red, to stay in the same warm-earth family
  error: '#B0503B',
  warning: '#F59E0B',
  gradientStart: '#FFFDF8',
  gradientEnd: '#F6F1E6',

  // --- Added for the dashboard redesign ---
  // Soft ink hairlines for quiet dividers (splitting a card in half, list rows).
  line: 'rgba(31, 51, 80, 0.12)',
  lineStrong: 'rgba(31, 51, 80, 0.2)',
  // Light wash of `accent` (teal), parallel to how `highlightSoft` washes `highlight`.
  accentSoft: '#DCEAE3',
  // Light wash of `error` (rust), for the sign-out affordance.
  errorSoft: '#F6E4DF',
};

export const typography = {
  fontFamily: {
    regular: 'Inter',
    medium: 'Inter',
    bold: 'Inter',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = StyleSheet.create({
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
});