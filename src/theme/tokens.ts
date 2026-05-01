import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  blueDeep: '#03045E',
  blue: '#0077B6',
  cyan: '#00B4D8',
  cyanLight: '#90E0EF',
  cyanSoft: '#CAF0F8',
  white: '#FFFFFF',
  textPrimary: '#03045E',
  textSecondary: '#0077B6',
  border: '#90E0EF',
  background: '#FFFFFF',
  backgroundSoft: '#CAF0F8',
  surface: '#FFFFFF',
  surfaceSoft: '#90E0EF',
  success: '#2E7D32',
  error: '#C62828',
  warning: '#ED6C02',
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 34,
};

export const typography = {
  h1: {
    fontSize: fontSizes.hero,
    fontWeight: '800',
    color: colors.textPrimary,
  } satisfies TextStyle,
  h2: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  } satisfies TextStyle,
  h3: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  } satisfies TextStyle,
  body: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  } satisfies TextStyle,
  caption: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  } satisfies TextStyle,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  pill: 999,
};

export const shadows = {
  subtle: {
    shadowColor: colors.blueDeep,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  } satisfies ViewStyle,
  medium: {
    shadowColor: colors.blueDeep,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  } satisfies ViewStyle,
};

export const opacity = {
  disabled: 0.45,
  pressed: 0.85,
  muted: 0.7,
};

export const interaction = {
  minTouchSize: 44,
  focusRingWidth: 2,
};

