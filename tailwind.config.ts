import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "xxs": ['8px', '10px'],
      },
      colors: {
        "primary": "#8b5cf6",
      },
      keyframes: {
        show: {
          "0%": {opacity: "0"},
          "100%": { opacity: "100"}
        }
      },
      animation: {
        "animate-show": "show 1s linear"
      }
    },
  },
  plugins: [],
} satisfies Config;
