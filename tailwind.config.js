/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/admin/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          dark: '#c59c17'
        }
      },
      fontFamily: {
        heading: ['Teko', 'sans-serif'],
        body: ['Rubik', 'sans-serif']
      }
    },
  },
  plugins: [],
}

