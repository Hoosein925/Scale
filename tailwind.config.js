/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury palette mapped directly from user's image reference
        petrol: {
          50: '#f0f7f8',
          100: '#d6eaec',
          200: '#aed4d8',
          300: '#649ea0', // Reference Swatch #649ea0
          400: '#458b92',
          500: '#2e838a', // Reference Swatch #2e838a
          600: '#096067', // Reference Swatch #096067
          700: '#074d53',
          800: '#073a3f',
          900: '#05262a',
          950: '#031719',
        },
        cognac: {
          300: '#f1ba86',
          400: '#e09854',
          500: '#ca7f3c', // Reference Swatch #ca7f3c
          600: '#ab6526',
          700: '#8b4e1a',
        },
        gold: {
          300: '#eedaa8',
          400: '#dbb86f',
          500: '#c69d5b', // Reference Swatch #c69d5b
          600: '#a77f39',
          700: '#866224',
        },
        pearl: {
          50: '#f9f8fc',
          100: '#e8e6f1', // Reference Swatch #e8e6f1
          200: '#d5d2e3',
          300: '#aea7c7',
        },
        // Seamlessly map 'indigo' across the whole application to the luxury petrol palette
        indigo: {
          50: '#f0f7f8',
          100: '#d6eaec',
          200: '#aed4d8',
          300: '#649ea0', // Reference swatch #649ea0
          400: '#458b92',
          500: '#2e838a', // Reference swatch #2e838a
          600: '#096067', // Reference swatch #096067
          700: '#074d53',
          800: '#073a3f',
          900: '#05262a',
          950: '#031719',
        },
      },
    },
  },
  plugins: [],
}
