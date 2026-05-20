export const COLORS = {
  // Brand
  blue: '#4F8FFF',
  violet: '#7B5CFF',
  mint: '#22D3A3',
  amber: '#FBBF24',
  red: '#F87171',
  // Text
  ink: '#0D1130',
  inkSecondary: '#4A5B8C',
  inkTertiary: '#8899BB',
  // Surfaces (light mode)
  background: '#F5F7FF',
  surface: '#FFFFFF',
  glassLight: 'rgba(255,255,255,0.65)',
  // Dark mode
  darkBg: '#07090F',
  darkCard: 'rgba(255,255,255,0.07)',
  // Gradients — use with LinearGradient
  gradientStart: '#4F8FFF',
  gradientEnd: '#7B5CFF',
};

export const GRADIENT_COLORS = ['#4F8FFF', '#7B5CFF'] as const;

export const SUBJECT_COLORS: Record<string, string> = {
  Physics: '#4F8FFF',
  Chemistry: '#7B5CFF',
  Mathematics: '#22D3A3',
  Biology: '#FBBF24',
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: '#22D3A3',
  Medium: '#FBBF24',
  Hard: '#F87171',
  'Previous Year': '#7B5CFF',
};

export const EXAM_COLORS: Record<string, string> = {
  'JEE Mains': '#4F8FFF',
  'JEE Advanced': '#7B5CFF',
  NEET: '#22D3A3',
  CBSE: '#FBBF24',
};
