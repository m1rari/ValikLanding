import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Темизация переключается классом .dark на <html>
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // Акцентные цвета (одинаковые в обеих темах)
        primary:   "#F5A623",
        electric:  "#2979FF",
        // Используется как текст НА жёлтом фоне (всегда тёмный)
        onPrimary: "#0F1117",

        // Остальные — через CSS-переменные, меняются при смене темы
        // Формат rgb(var(...) / <alpha-value>) позволяет использовать
        // модификатор прозрачности: bg-dark/90, bg-surface/95 и т.д.
        dark:       "rgb(var(--bg-base)    / <alpha-value>)",
        surface:    "rgb(var(--bg-surface) / <alpha-value>)",
        muted:      "rgb(var(--color-muted)    / <alpha-value>)",
        foreground: "rgb(var(--color-fg)   / <alpha-value>)",
      },

      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },

      animation: {
        pulse_cta: "pulse_cta 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pulse_cta: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 166, 35, 0.7)" },
          "50%":      { boxShadow: "0 0 0 12px rgba(245, 166, 35, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
