/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        gold: {
          50: '#fdf8ef',
          100: '#f9edda',
          200: '#f0d5a8',
          300: '#e5b873',
          400: '#c9a96e',
          500: '#b8943f',
          600: '#9a7530',
          700: '#7a5a28',
          800: '#5f4423',
          900: '#4a3520',
        },
      },
    },
  },
  plugins: [],
};
