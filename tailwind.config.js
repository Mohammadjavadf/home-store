/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        surface: '#FFFFFF',
        ink: '#1C1917',
        night: '#0F0F12',
        'night-surface': '#1A1A1F',
        'night-ink': '#F5F5F4',
        copper: {
          DEFAULT: '#B87333',
          light: '#D4A373',
          dark: '#8B5A2B',
        },
        forest: {
          DEFAULT: '#2D6A4F',
          light: '#40916C',
        },
      },
      fontFamily: {
        display: ['"Vazirmatn"', 'sans-serif'],
        body: ['"Vazirmatn"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(28, 25, 23, 0.12)',
        glow: '0 0 40px -10px rgba(184, 115, 51, 0.35)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};