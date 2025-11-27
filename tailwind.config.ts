import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B35",
          light: "#FF8C61",
          dark: "#E85A2A",
          50: "#FFF4F0",
          100: "#FFE8DD",
        },
        secondary: {
          DEFAULT: "#4CAF50",
          light: "#66BB6A",
          dark: "#388E3C",
        },
        accent: {
          DEFAULT: "#FF5252",
          light: "#FF6E6E",
          dark: "#E63946",
        },
        background: "#FFF8F5",
        surface: "#FFFFFF",
        text: {
          DEFAULT: "#2C3E50",
          light: "#5D6D7E",
          muted: "#95A5A6",
        },
        border: {
          DEFAULT: "#F0E6DC",
          light: "#F8F1EA",
        },
        success: {
          DEFAULT: "#4CAF50",
          light: "#66BB6A",
          dark: "#388E3C",
        },
        error: {
          DEFAULT: "#FF5252",
          light: "#FF6E6E",
          dark: "#E63946",
        },
        warning: {
          DEFAULT: "#FFA726",
          light: "#FFB74D",
          dark: "#F57C00",
        },
      },
    },
  },
  plugins: [],
};
export default config;
