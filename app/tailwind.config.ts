import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter var, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
        ],
        mono: [
          "JetBrains Mono, SF Mono, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
        ],
      },
      colors: {
        background: {
          light: "#FFFFFF",
          dark: "#1E1E1E",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#252525",
        },
      },
      boxShadow: {
        subtle:
          "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
