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
import Link from "next/link";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ThemeToggle";

type NavLink = {
  label: string;
  href: string;
  type: "section" | "page";
};

const navLinks = [
  { label: "Услуги", href: "#services", type: "section" },
  { label: "Форматы работы", href: "#formats", type: "section" },
  { label: "Примеры работ", href: "#works", type: "section" },
  { label: "Цены", href: "/prices", type: "page" },
  { label: "Контакты", href: "#contacts", type: "section" },
] satisfies NavLink[];

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

  const handleSectionClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className={`fixed left-3 right-3 top-3 z-50 transition-all duration-300 lg:left-6 lg:right-6 ${
        scrolled
          ? "rounded-2xl bg-dark/92 backdrop-blur-md border border-foreground/10 shadow-lg shadow-black/10"
          : "rounded-2xl bg-dark/75 backdrop-blur-sm border border-foreground/10"
      }`}
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          {/* ---- Логотип ---- */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-onPrimary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Электро<span className="text-primary">Мастер</span>
            </span>
          </Link>

          {/* ---- Навигация (десктоп) ---- */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.type === "section" ? (
                <button
                  key={link.href}
                  onClick={() => handleSectionClick(link.href)}
                  className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              )
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
              aria-label="Написать в Viber"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M11.4 1.1C7.2 1.4 3.8 4.4 3 8.5c-.4 2-.3 3.9.4 5.7L3 17.4c-.1.5.1 1 .6 1.2.2.1.4.1.6.1l3.3-.4c1.6.8 3.3 1.2 5.1 1.1 5.2-.2 9.3-4.5 9.2-9.7-.1-5-4.3-8.9-10.4-8.6zm4.8 12.8c-.3.5-.8 1-1.3 1.1-.4.1-.8.1-1.2-.1-.8-.3-1.6-.7-2.3-1.2-1.5-1-2.7-2.3-3.5-3.9-.4-.8-.7-1.6-.7-2.5 0-.5.2-1 .5-1.4.3-.4.7-.7 1.1-.8.5-.1 1 .2 1.2.6l.9 1.9c.2.4.1.8-.2 1.1l-.4.4c-.1.1-.1.3 0 .5.4.8 1 1.5 1.7 2.1.5.4 1 .7 1.6.9.2.1.4 0 .5-.1l.4-.4c.3-.3.7-.4 1.1-.2l1.8 1c.5.3.7.9.4 1.4l-.6.6z"/>
              </svg>
              <span className="sr-only">Написать в Viber</span>
            </a>

            <a
              href="https://t.me/+375291645388"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-sky-600/20 hover:bg-sky-600/40 text-sky-500 hover:text-sky-400 transition-all duration-200"
              title="Telegram"
              aria-label="Написать в Telegram"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.69 7.96c-.12.56-.46.69-.93.43l-2.57-1.89-1.24 1.19c-.14.14-.25.25-.52.25l.18-2.62 4.74-4.28c.21-.18-.04-.28-.31-.1L7.4 14.27 4.87 13.5c-.55-.17-.56-.55.11-.82l10.03-3.87c.46-.17.86.11.63.99z"/>
              </svg>
              <span className="sr-only">Написать в Telegram</span>
            </a>

            {/* Переключатель темы */}
            <ThemeToggle />

            <Button variant="primary" size="sm" onClick={() => handleSectionClick("#contacts")}>
              Вызвать мастера
            </Button>
          </div>

          {/* ---- Бургер + тема (мобиль) ---- */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />

            <button
              className="p-2 text-foreground hover:text-primary transition-colors cursor-pointer"
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
            link.type === "section" ? (
              <button
                key={link.href}
                onClick={() => handleSectionClick(link.href)}
                className="text-left py-2 text-foreground/70 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-left py-2 text-foreground/70 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </Link>
            )
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
          <Button variant="primary" size="md" className="mt-2" onClick={() => handleSectionClick("#contacts")}>
            Вызвать мастера
          </Button>
        </div>
      </motion.div>
    </motion.header>
  );
}
