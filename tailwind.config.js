/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    //definição de cores padrão no projeto
    
    extend: {
      rotate: {
        '_45': '-45deg'
      },
      colors: {
        'salmon': '#E7C192',
        'transparent': 'rgb(0,0,0,0)',
        'half-transparent': 'rgb(0,0,0,0.8)',
        'dark': 'rgb(31,41,55,1)',
        'light': 'rgb(255,255,255,1)',
        'dark-border': 'rgb(31,41,55,0.1)',
      },
      transitionProperty: {
        'width': 'width'
      }
    },
  },
  variants: {
    extend: {
      opacity: ['responsive', 'hover', 'focus', 'disabled'],
      display: ['focus-group'] //usado no navbar
    },
    
  },
  plugins: [],
}

