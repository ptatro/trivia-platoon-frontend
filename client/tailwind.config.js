module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'spaceCadet': '#2B2D42',
      'manatee': '#8D99AE',
      'aliceBlue': '#EDF2F4',
      'imperialRed': '#EF2E45',
      'amaranthRed': '#D90429',
    }),
    textColor: theme => ({
      ...theme('colors'),
      'spaceCadet': '#2B2D42',
      'manatee': '#8D99AE',
      'aliceBlue': '#EDF2F4',
      'imperialRed': '#EF2E45',
      'amaranthRed': '#D90429',
    }),
    borderColor: theme => ({
      ...theme('colors'),
      'spaceCadet': '#2B2D42',
      'manatee': '#8D99AE',
      'aliceBlue': '#EDF2F4',
      'imperialRed': '#EF2E45',
      'amaranthRed': '#D90429',
    }),
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
