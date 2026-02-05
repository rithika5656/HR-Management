/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5',
          600: '#1a237e',
          700: '#151b60',
          800: '#101442',
          900: '#0a0d24',
        },
        kite: {
          blue: '#1a237e',
          red: '#c62828',
          light: '#e8eaf6',
        }
      },
    },
  },
  plugins: [],
}
