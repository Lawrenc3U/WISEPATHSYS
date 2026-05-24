import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#5B3EFE',
  primaryLight: '#8B6FFF',
  secondary: '#E94B9B',
  accent: '#7C6FFF',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceElevated: '#FAFAFE',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E8E8F0',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  gradientStart: '#5B3EFE',
  gradientEnd: '#E94B9B',
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
