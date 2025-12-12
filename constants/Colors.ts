/**
 * Design Tokens for StrayMatch-MVP
 * Production-grade color system
 */

export const Colors = {
  primary: '#3B82F6',      // Blue
  secondary: '#F59E0B',    // Amber
  danger: '#EF4444',       // Red
  background: '#F8FAFC',   // Slate-50
  card: '#FFFFFF',         // White
  text: '#1E293B',         // Slate-800
  textSecondary: '#64748B', // Slate-500
  border: '#E2E8F0',       // Slate-200
  success: '#10B981',      // Green
  warning: '#F59E0B',      // Amber
  info: '#3B82F6',         // Blue
};

export const Gradients = {
  primary: ['#3B82F6', '#2563EB'],     // Blue gradient
  secondary: ['#F59E0B', '#D97706'],   // Amber gradient
  hero: ['#3B82F6', '#8B5CF6'],        // Blue to Purple
};

export const Shadows = {
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
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};
