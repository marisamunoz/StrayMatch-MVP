/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#F59E0B',
        danger: '#EF4444',
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: '#1E293B',
        'text-secondary': '#64748B',
        border: '#E2E8F0',
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
    },
  },
  plugins: [],
};
