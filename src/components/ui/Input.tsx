// ============================================================
// КОМПОНЕНТ ПОЛЯ ВВОДА (Input)
// Стилизованный input с поддержкой label и сообщения об ошибке.
// Используется в форме LeadForm.tsx.
// forwardRef нужен для совместимости с react-hook-form (register).
// ============================================================

"use client";

import { InputHTMLAttributes, forwardRef } from "react";

// Расширяем стандартные HTML-атрибуты input своими пропсами
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Текст подписи над полем
  error?: string; // Текст ошибки под полем (появляется при неверном вводе)
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      // Обёртка с flex-колонкой — label сверху, input посередине, ошибка снизу
      <div className="flex flex-col gap-1">

        {/* Подпись над полем (если передан label) */}
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-300">
            {label}
          </label>
        )}

        {/* Само поле ввода */}
        <input
          ref={ref}
          id={id}
          className={`w-full px-4 py-3 rounded-lg bg-dark border ${
            // Красная рамка при ошибке, жёлтая при фокусе в норме
            error
              ? "border-red-500 focus:border-red-400"
              : "border-white/20 focus:border-primary"
          } text-white placeholder-muted outline-none transition-colors duration-200 ${className}`}
          {...props} // Передаём все остальные атрибуты (type, placeholder, value и т.д.)
        />

        {/* Сообщение об ошибке (если есть) */}
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
