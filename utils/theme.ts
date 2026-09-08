import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#E3F2FD',
  primaryLight: '#FFFFFF', // Lighter than primary? Primary is already very light.
  secondary: '#FFFCE1',
  accent: '#95BDD7',
  /** Stronger blue for selected states / CTAs (primary matches page background) */
  highlight: '#3D7A9E',
  highlightSoft: '#E8F1F7',
  background: '#E3F2FD',
  surface: '#FFFCE1',
  surfaceElevated: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#95BDD7',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  gradientStart: '#E3F2FD',
  gradientEnd: '#FFFCE1',
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
