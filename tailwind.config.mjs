/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/*", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        onxy: "#181818",
        brightWhite: "#fbfbfb",
        faintblack: "rgba(255, 255, 255, 0.5)",
        blur: "hsl(0 0% 100% / .05)",
        black101: "rgba(21, 21, 21, 0.5)",
        white25: "rgba(255, 255, 255, 0.5)",
        white10: "rgba(255, 255, 255, 0.1)",
        white70: "rgba(255, 255, 255, 0.7)",
        blue: "rgba(63, 100, 233, 0.43)",
        red: "rgba(233, 63, 63, 0.43)",
        golden: "hsla(43, 100%, 50%, 0.43)",
        dimeblack: "#0d0d0d",
        darkGray: "#808080",
        mediumGray: "rgba(128, 128, 128, 0.5)",
        lightGray: "#c5c5c5",
        borderDark: "#383737",
        lightBorder: "#ebebeb",
        body: "#FFFFF0",
      },
      utilities: {
        baseSpace: "mt-5",
        baseFont: "sm",
        lineHeight: "leading-6",
        keyframes: {
          ping: {
            "75%, 100%": {
              content: "",
              transform: "scale(2)",
              opacity: 0,
            },
          },
        },
        animation: {
          "ping-200": " ping 1s 200ms cubic-bezier(0, 0, 0.2, 1) infinite",
        },
      },
    },
    screens: {//please do not delete or temper with abeg 🤦‍♂️
      'sm': '640px',
      // => @media (min-width: 640px) { ... }
      'md': '768px',
      // => @media (min-width: 768px) { ... }
      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }
      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }
      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      'tall': { 'min': '2000px' },
      'maxScreen': { 'max': '1050px' },
      'maxScreenMobile': { 'max': '768px' },
    },
    plugins: [],
  }
};
