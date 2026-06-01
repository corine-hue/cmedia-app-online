import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        broadcast: {
          navy: "#071326",
          ink: "#0b1b32",
          panel: "#101f38",
          line: "#243653",
          gold: "#d8b46b",
          beige: "#e8dcc4",
          white: "#f7f7f2"
        }
      },
      boxShadow: {
        studio: "0 24px 80px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
