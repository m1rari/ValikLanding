// ============================================================
// КОНФИГУРАЦИЯ TAILWIND CSS
// Здесь задаётся дизайн-система проекта:
// фирменные цвета, шрифты и анимации кнопки CTA
// ============================================================

import type { Config } from "tailwindcss";

const config: Config = {
  // Tailwind сканирует эти пути и генерирует только те классы, которые реально используются
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ---- Фирменные цвета ----
      colors: {
        primary:  "#F5A623", // Жёлтый акцент — кнопки, иконки, выделение
        electric: "#2979FF", // Электрический синий — для вкладки «С проектом»
        dark:     "#0F1117", // Основной фон всей страницы
        surface:  "#1A1F2E", // Фон карточек и вторичных блоков
        muted:    "#6B7280", // Вспомогательный серый текст
      },

      // ---- Шрифт ----
      // Montserrat подключается через Next.js (layout.tsx) и передаётся CSS-переменной
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },

      // ---- Кастомная анимация «пульс» для CTA-кнопки ----
      // Создаёт эффект расходящейся жёлтой волны вокруг кнопки
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
