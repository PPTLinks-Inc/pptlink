/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/*", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      tall: { min: "2000px" },
      maxScreen: { max: "1050px" },
      maxScreenMobile: { max: "768px" },
      maxSmallMobile: { max: "468px" }
    },

    extend: {
      colors: {
        // Solid colors
        onxy: "#181818",
        brightWhite: "#fbfbfb",
        dimeblack: "#0d0d0d",
        darkGray: "#808080",
        lightGray: "#c5c5c5",

        // Transparent colors
        faintblack: "rgba(255, 255, 255, 0.5)",
        white25: "rgba(255, 255, 255, 0.5)",
        white10: "rgba(255, 255, 255, 0.1)",
        white70: "rgba(255, 255, 255, 0.7)",
        blue: "rgba(63, 100, 233, 0.43)",
        red: "rgba(233, 63, 63, 0.43)",
        golden: "hsla(43, 100%, 50%, 0.43)",
        mediumGray: "rgba(128, 128, 128, 0.5)",

        // Borders
        borderDark: "#383737",
        lightBorder: "#ebebeb",

        // Theme colors
        body: "#FFFFF0",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        primaryTwo: "#191919",
        primaryThree: "#FFFFF0",
        primaryFour: "#e2e8f0",
        primaryFive: "#ffffff12",
        primarySix: "#ffa60033",
        primarySeven: "rgba(#ffffff, 0.1)",

        // Component colors
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        }
      },

      boxShadow: {
        altShadow: "0px 0px 15px rgba(255,166,0,0.53)"
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        pinging: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.2)", opacity: "0.6" },
          "100%": { transform: "scale(1.5)", opacity: "0" }
        }
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pinging: "pinging 1s infinite"
      }
    }
  },

  plugins: [require("tailwindcss-animate")]
};
