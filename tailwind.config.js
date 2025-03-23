/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        green: {
          600: '#10B981',
        },
        yellow: {
          600: '#F59E0B',
        },
        red: {
          600: '#EF4444',
        },
        gray: {
          50: '#F9FAFB',
          800: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
      },
      padding: {
        '16': '4rem',
      },
    },
  },
  plugins: [],
}