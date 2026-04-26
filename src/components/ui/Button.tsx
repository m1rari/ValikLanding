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
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      // text-onPrimary — всегда тёмный (#0F1117), не зависит от темы
      primary: "bg-primary text-onPrimary shadow-[0_10px_24px_rgba(245,166,35,0.22)] hover:bg-yellow-400 hover:shadow-[0_12px_28px_rgba(245,166,35,0.28)] active:translate-y-px",
      outline: "border border-foreground/20 bg-surface text-foreground hover:border-primary/60 hover:text-primary active:translate-y-px",
      ghost:   "text-foreground hover:text-primary active:translate-y-px",
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
