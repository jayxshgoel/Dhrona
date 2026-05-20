/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Dhrona brand palette
        dblue: {
          50: '#EEF4FF',
          100: '#DDEAFF',
          300: '#93BBFF',
          500: '#4F8FFF',
          600: '#3A7AEE',
          700: '#2B65D9',
          DEFAULT: '#4F8FFF',
        },
        dviolet: {
          50: '#F3EFFE',
          100: '#EAE0FD',
          300: '#B49AF8',
          500: '#7B5CFF',
          600: '#6547EE',
          700: '#5034D9',
          DEFAULT: '#7B5CFF',
        },
        dmint: {
          50: '#ECFDF9',
          100: '#D0FAF1',
          500: '#22D3A3',
          600: '#16B892',
          DEFAULT: '#22D3A3',
        },
        // Semantic
        ink: '#0D1130',
        'ink-secondary': '#4A5B8C',
        'ink-tertiary': '#8899BB',
        // Surfaces
        'surface-light': '#F5F7FF',
        'surface-card': 'rgba(255,255,255,0.65)',
        // Dark mode
        'dark-bg': '#07090F',
        'dark-card': 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        display: ['SpaceGrotesk_700Bold', 'System'],
        heading: ['SpaceGrotesk_600SemiBold', 'System'],
        body: ['PlusJakartaSans_400Regular', 'System'],
        'body-medium': ['PlusJakartaSans_500Medium', 'System'],
        'body-semibold': ['PlusJakartaSans_600SemiBold', 'System'],
        'body-bold': ['PlusJakartaSans_700Bold', 'System'],
      },
      borderRadius: {
        card: '20px',
        btn: '12px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};
