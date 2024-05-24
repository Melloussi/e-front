/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        lightbrown: {
          DEFAULT: '#D2B48C',
          dark: '#A67B5B',
        },
      },
    },
  },
  plugins: [],
};
