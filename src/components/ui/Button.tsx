// ============================================================
// КОМПОНЕНТ КНОПКИ (Button)
// Переиспользуемая кнопка с тремя вариантами оформления и тремя размерами.
// Обёрнута в motion.button от Framer Motion — поэтому умеет анимироваться
// при наведении (scale вверх) и нажатии (scale вниз).
// ============================================================

"use client"; // Компонент работает на клиенте (нужны события мыши и анимации)

import React from "react";
import { motion } from "framer-motion";

// ---- Типы пропсов ----
interface ButtonProps {
  variant?: "primary" | "outline" | "ghost"; // Визуальный стиль кнопки
  size?: "sm" | "md" | "lg";                  // Размер кнопки
  pulse?: boolean;                             // Включить ли пульсирующую анимацию (для CTA)
  className?: string;                          // Дополнительные CSS-классы
  children?: React.ReactNode;                  // Содержимое кнопки (текст, иконки)
  disabled?: boolean;                          // Заблокировать кнопку
  type?: "button" | "submit" | "reset";        // HTML-тип кнопки
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // Обработчик клика
  "aria-label"?: string;                       // Подпись для скринридеров
}

// forwardRef позволяет передавать ref снаружи (например, для фокуса)
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      pulse = false,
      className = "",
      children,
      disabled,
      type = "button",
      onClick,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    // ---- Базовые классы (общие для всех вариантов) ----
    const base =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed";

    // ---- Варианты оформления ----
    const variants = {
      primary: "bg-primary text-dark hover:bg-yellow-400 active:scale-95",   // Жёлтая заливка
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-dark active:scale-95", // Контурная
      ghost:   "text-white hover:text-primary active:scale-95",              // Прозрачная
    };

    // ---- Размеры ----
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      // motion.button — обычная кнопка, но с поддержкой анимаций Framer Motion
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`${base} ${variants[variant]} ${sizes[size]} ${
          pulse ? "animate-pulse_cta" : "" // Класс пульсации из tailwind.config.ts
        } ${className}`}
        whileHover={{ scale: 1.03 }} // При наведении — чуть увеличивается
        whileTap={{ scale: 0.97 }}   // При нажатии — чуть уменьшается
        onClick={onClick}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
