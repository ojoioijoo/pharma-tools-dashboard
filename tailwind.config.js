/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#5B6EF5', hover: '#4453D8' },
        danger: '#EF5C6E',
      },
      boxShadow: {
        card: '0 10px 26px -16px rgba(28,29,33,0.12)',
      },
    },
  },
  plugins: [],
};
