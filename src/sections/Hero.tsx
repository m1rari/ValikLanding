"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

function fadeInUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  };
}

export default function Hero() {
  const [showContact, setShowContact] = useState(false);

  const handleScrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ================================================================
          ФОН СЕКЦИИ — адаптируется к теме через dark: классы
          ================================================================ */}
      <div className="absolute inset-0 z-0">
        {/* Основной градиент фона */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-blue-50/60 dark:from-[#0a0d14] dark:via-[#0F1117] dark:to-[#111827]" />

        {/* Паттерн электросхемы */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5A623' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Радиальное жёлтое свечение */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,rgba(245,166,35,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,rgba(245,166,35,0.08),transparent)]" />

        {/* Затемнение/осветление снизу — плавный переход */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-dark to-transparent" />
      </div>

      {/* Анимированные частицы */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40 dark:bg-primary/60"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* ================================================================
          ОСНОВНОЙ КОНТЕНТ
          ================================================================ */}
      <div className="container-custom relative z-10 pt-20 pb-28 sm:pt-24 sm:pb-20">
        <div className="max-w-3xl">

          {/* Бадж */}
          <motion.div
            {...fadeInUp(0)}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs sm:text-sm font-medium mb-5 sm:mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
            Выезд мастера в день обращения
          </motion.div>

          {/* H1 */}
          <motion.h1
            {...fadeInUp(0.15)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6"
          >
            Комплекс{" "}
            <span className="text-gradient">электромонтажных</span>{" "}
            работ в частном доме, квартире или офисе
          </motion.h1>

          {/* Подзаголовок */}
          <motion.p
            {...fadeInUp(0.3)}
            className="text-base sm:text-lg md:text-xl text-foreground/60 mb-8 sm:mb-10 max-w-2xl leading-relaxed"
          >
            Надёжно, по стандартам.{" "}
            <span className="text-foreground font-medium">Выезд мастера в день обращения.</span>{" "}
            Работаем в Пинске и Пинском районе.
          </motion.p>

          {/* CTA-кнопки */}
          <motion.div
            {...fadeInUp(0.45)}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              pulse
              className="w-full sm:w-auto justify-center"
              onClick={() => setShowContact(true)}
            >
              <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Вызвать мастера
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto justify-center"
              onClick={() => handleScrollTo("#contacts")}
            >
              Рассчитать стоимость
            </Button>
          </motion.div>

          {/* Метки доверия */}
          <motion.div
            {...fadeInUp(0.6)}
            className="flex flex-wrap gap-4 sm:gap-6 mt-8 sm:mt-12"
          >
            {[
              { icon: "📋", text: "Официальный договор"   },
              { icon: "⚡", text: "Работаем с 2015 года"  },
              { icon: "📍", text: "Пинск и Пинский район" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-xs sm:text-sm text-foreground/60">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ================================================================
          МОДАЛКА: ПОЗВОНИТЬ МАСТЕРУ
          ================================================================ */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowContact(false)}
            />

            <motion.div
              className="relative bg-dark border border-primary/30 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
                aria-label="Закрыть"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>

              <div className="text-4xl mb-3">📞</div>
              <h3 className="text-xl font-bold mb-1">Позвоните нам</h3>
              <p className="text-muted text-sm mb-6">Работаем в Пинске и Пинском районе</p>

              <div className="flex flex-col gap-3">
                <a
                  href="tel:+375291645388"
                  className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-primary text-onPrimary font-semibold hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  +375 (29) 164-53-88
                </a>

                <a
                  href="viber://chat?number=375291645388"
                  className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-[#7360F2] text-white font-semibold hover:bg-[#7360F2]/90 transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.8 0 .9 4.6.9 10.4c0 3 1.3 5.8 3.5 7.8V21l3.3-1.8c1.2.3 2.5.5 3.8.5 6.2 0 11.1-4.6 11.1-10.3S18.2 0 12 0zm1.1 14l-2.8-3-1.8 3-3.1-3.2 5.7-6 2.8 3 1.8-3 3.1 3.2L13.1 14z"/>
                  </svg>
                  Viber
                </a>

                <a
                  href="https://t.me/+375291645388"
                  className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-[#2AABEE] text-white font-semibold hover:bg-[#2AABEE]/90 transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.03 9.565c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.13 14.28l-2.963-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.69.306z"/>
                  </svg>
                  Telegram
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Индикатор прокрутки вниз */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-muted text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span>Прокрутите вниз</span>
        <motion.div
          className="w-0.5 h-8 bg-gradient-to-b from-muted to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
