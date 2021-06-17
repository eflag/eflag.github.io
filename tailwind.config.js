const colors = require('tailwindcss/colors')
module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
        colors: {
      pink: '#ff00f7',
      green: '#4dff00',
        },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
