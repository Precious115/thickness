/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        premium: '#f59e0b',
        dark: 'var(--bg)',
        card: 'var(--card)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
};
