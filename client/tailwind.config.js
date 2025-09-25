/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          400: '#ff7849',
          500: '#ff6b3d',
          600: '#ff5722',
          700: '#f4511e',
        },
      },
    },
  },
  plugins: [],
};