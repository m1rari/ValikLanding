"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
}

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
    const base =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
      // text-onPrimary — всегда тёмный (#0F1117), не зависит от темы
      primary: "bg-primary text-onPrimary hover:bg-yellow-400 active:scale-95",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-onPrimary active:scale-95",
      ghost:   "text-foreground hover:text-primary active:scale-95",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`${base} ${variants[variant]} ${sizes[size]} ${
          pulse ? "animate-pulse_cta" : ""
        } ${className}`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
