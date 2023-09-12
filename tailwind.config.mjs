/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/*', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        onxy: '#181818',
        brightWhite: '#fbfbfb',
        faintblack: 'rgba(255, 255, 255, 0.5)',
        blur: 'hsl(0 0% 100% / .05)',
        black101: 'rgba(21, 21, 21, 0.5)',
        white25: 'rgba(255, 255, 255, 0.5)',
        white10: 'rgba(255, 255, 255, 0.1)',
        white70: 'rgba(255, 255, 255, 0.7)',
        blue: 'rgba(63, 100, 233, 0.43)',
        red: 'rgba(233, 63, 63, 0.43)',
        golden: 'hsla(43, 100%, 50%, 0.43)',
        dimeblack: '#0d0d0d',
        darkGray: '#808080',
        mediumGray: 'rgba(128, 128, 128, 0.5)',
        lightGray: '#c5c5c5',
        borderDark: '#383737',
        lightBorder: '#ebebeb',
      },
    },
  },
  plugins: [],
};
