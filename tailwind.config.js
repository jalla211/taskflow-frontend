/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        secondary: '#2E5A88',
        accent: '#4A90D9',
        success: '#28A745',
        warning: '#FFC107',
        danger: '#DC3545',
      }
    },
  },
  plugins: [],
}