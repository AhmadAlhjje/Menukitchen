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
        primary: "#3A86FF",
        secondary: "#6C63FF",
        accent: "#FFBE0B",
        background: "#F7F8FA",
        surface: "#FFFFFF",
        text: "#0F172A",
        success: "#16A34A",
        error: "#EF4444",
      },
    },
  },
  plugins: [],
};
export default config;
