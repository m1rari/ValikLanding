// ============================================================
// СЕКЦИЯ: ШАПКА САЙТА (Header)
// «Липкая» (sticky) навигация — всегда видна при прокрутке.
// При скролле вниз — скрывается (прячется за верхний край).
// При скролле вверх — появляется обратно.
// На мобильных — бургер-меню.
// ============================================================

"use client"; // Нужен на клиенте: отслеживаем скролл и состояние меню

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { label: "Услуги",         href: "#services"  },
  { label: "Форматы работы", href: "#formats"   },
  { label: "Примеры работ",  href: "#works"     },
  { label: "Этапы",          href: "#timeline"  },
  { label: "Контакты",       href: "#contacts"  },
];

export default function Header() {
  const [hidden, setHidden]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 80);
    setScrolled(latest > 20);
  });

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark/90 backdrop-blur-md border-b border-foreground/10 shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ---- Логотип ---- */}
          <a
            href="#"
            className="flex items-center gap-2 group"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-onPrimary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Электро<span className="text-primary">Мастер</span>
            </span>
          </a>

          {/* ---- Навигация (десктоп) ---- */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* ---- Правый блок: телефон + мессенджеры + тема + кнопка ---- */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+375291645388"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
              +375 (29) 164-53-88
            </a>

            <a
              href="viber://chat?number=%2B375291645388"
              className="p-2 rounded-lg bg-purple-700/20 hover:bg-purple-700/40 text-purple-500 hover:text-purple-400 transition-all duration-200"
              title="Viber"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 1.1C7.2 1.4 3.8 4.4 3 8.5c-.4 2-.3 3.9.4 5.7L3 17.4c-.1.5.1 1 .6 1.2.2.1.4.1.6.1l3.3-.4c1.6.8 3.3 1.2 5.1 1.1 5.2-.2 9.3-4.5 9.2-9.7-.1-5-4.3-8.9-10.4-8.6zm4.8 12.8c-.3.5-.8 1-1.3 1.1-.4.1-.8.1-1.2-.1-.8-.3-1.6-.7-2.3-1.2-1.5-1-2.7-2.3-3.5-3.9-.4-.8-.7-1.6-.7-2.5 0-.5.2-1 .5-1.4.3-.4.7-.7 1.1-.8.5-.1 1 .2 1.2.6l.9 1.9c.2.4.1.8-.2 1.1l-.4.4c-.1.1-.1.3 0 .5.4.8 1 1.5 1.7 2.1.5.4 1 .7 1.6.9.2.1.4 0 .5-.1l.4-.4c.3-.3.7-.4 1.1-.2l1.8 1c.5.3.7.9.4 1.4l-.6.6z"/>
              </svg>
            </a>

            <a
              href="https://t.me/+375291645388"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-sky-600/20 hover:bg-sky-600/40 text-sky-500 hover:text-sky-400 transition-all duration-200"
              title="Telegram"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.69 7.96c-.12.56-.46.69-.93.43l-2.57-1.89-1.24 1.19c-.14.14-.25.25-.52.25l.18-2.62 4.74-4.28c.21-.18-.04-.28-.31-.1L7.4 14.27 4.87 13.5c-.55-.17-.56-.55.11-.82l10.03-3.87c.46-.17.86.11.63.99z"/>
              </svg>
            </a>

            {/* Переключатель темы */}
            <ThemeToggle />

            <Button variant="primary" size="sm" onClick={() => handleNavClick("#contacts")}>
              Вызвать мастера
            </Button>
          </div>

          {/* ---- Бургер + тема (мобиль) ---- */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />

            <button
              className="p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Меню"
            >
              <motion.div
                animate={menuOpen ? "open" : "closed"}
                className="flex flex-col gap-1.5 w-6"
              >
                <motion.span
                  className="block h-0.5 bg-current rounded-full"
                  variants={{ open: { rotate: 45, y: 8 }, closed: { rotate: 0, y: 0 } }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="block h-0.5 bg-current rounded-full"
                  variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="block h-0.5 bg-current rounded-full"
                  variants={{ open: { rotate: -45, y: -8 }, closed: { rotate: 0, y: 0 } }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* ---- Мобильное меню ---- */}
      <motion.div
        className="lg:hidden bg-surface/95 backdrop-blur-md border-t border-foreground/10 overflow-hidden"
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container-custom py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-left py-2 text-foreground/70 hover:text-primary font-medium transition-colors"
            >
              {link.label}
            </button>
          ))}
          <hr className="border-foreground/10" />
          <a
            href="tel:+375291645388"
            className="flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
            +375 (29) 164-53-88
          </a>
          <div className="flex gap-3">
            <a href="viber://chat?number=%2B375291645388" className="flex items-center gap-2 text-purple-500 hover:text-purple-400 font-medium transition-colors">
              Viber
            </a>
            <a href="https://t.me/+375291645388" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-500 hover:text-sky-400 font-medium transition-colors">
              Telegram
            </a>
          </div>
          <Button variant="primary" size="md" className="mt-2" onClick={() => handleNavClick("#contacts")}>
            Вызвать мастера
          </Button>
        </div>
      </motion.div>
    </motion.header>
  );
}
