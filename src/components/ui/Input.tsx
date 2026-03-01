"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-foreground/70">
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          className={`w-full px-4 py-3 rounded-lg bg-dark border ${
            error
              ? "border-red-500 focus:border-red-400"
              : "border-foreground/20 focus:border-primary"
          } text-foreground placeholder:text-muted outline-none transition-colors duration-200 ${className}`}
          {...props}
        />

        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
