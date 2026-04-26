"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";

function fadeInUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  };
}

function LineIcon({
  name,
  className = "w-5 h-5",
}: {
  name: "phone" | "clipboard" | "bolt" | "pin" | "close" | "shield" | "check" | "tool" | "message";
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.66 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.23a2 2 0 0 1 2.11-.45c.84.32 1.72.54 2.62.66A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common}>
          <path d="M9 4h6" />
          <path d="M9 2h6v4H9z" />
          <path d="M6 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M13 2 3 14h8l-1 8 11-13h-8l1-7Z" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "tool":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0 4.97 4.97L11 19.93a2.5 2.5 0 0 1-3.54-3.54l8.66-8.66a4 4 0 0 0-1.42-1.43Z" />
          <path d="m7 17 1 1" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      );
  }
}

export default function Hero() {
  const [showContact, setShowContact] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleScrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(31,28,25,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(31,28,25,0.035)_1px,transparent_1px)] bg-[size:36px_36px] dark:bg-[linear-gradient(rgba(255,250,240,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,250,240,0.045)_1px,transparent_1px)]"
          animate={shouldReduceMotion ? undefined : { backgroundPosition: ["0px 0px", "36px 36px"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-0 top-0 h-full w-2 bg-primary shadow-[0_0_28px_rgba(245,158,11,0.45)]"
          animate={shouldReduceMotion ? undefined : { opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1], x: [0, 18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-foreground/10" />
      </div>

      <div className="container-custom relative z-10 pt-24 pb-16 sm:pt-28 lg:pt-32">
        <div className="max-w-4xl">

          {/* Бадж */}
          <motion.div
            {...fadeInUp(0)}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full bg-surface border border-foreground/10 text-foreground text-xs sm:text-sm font-semibold mb-5 sm:mb-6 shadow-sm"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-primary flex-shrink-0"
              animate={shouldReduceMotion ? undefined : { scale: [1, 1.45, 1], opacity: [1, 0.65, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            Консультация в день обращения
          </motion.div>

          {/* H1 */}
          <motion.h1
            {...fadeInUp(0.15)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6"
          >
            Электрик в Пинске:{" "}
            <span className="text-primary">установка и ремонт электропроводки</span>
          </motion.h1>

          {/* Подзаголовок */}
          <motion.p
            {...fadeInUp(0.3)}
            className="text-base sm:text-lg md:text-xl text-muted mb-8 sm:mb-10 max-w-2xl leading-relaxed"
          >
            ИП Шугайло Валентин Георгиевич выполняет электромонтажные работы в
            Пинске и Пинском районе для квартир, частных домов, офисов и
            коммерческих помещений. Устанавливаем и ремонтируем электропроводку,
            собираем электрощиты, подключаем розетки, освещение и мощные
            потребители. Работаем по договору, заранее объясняем решения,
            фиксируем условия до старта и выполняем работу аккуратно. Чтобы вызвать мастера,
            позвоните, напишите в Viber или Telegram либо оставьте заявку на сайте.
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
              <LineIcon name="phone" className="w-5 h-5 mr-2 flex-shrink-0" />
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
            className="grid gap-3 sm:grid-cols-3 sm:gap-4 mt-8 sm:mt-12"
          >
            {[
              { icon: "clipboard" as const, text: "Официальный договор" },
              { icon: "bolt" as const, text: "Опыт с 2015 года" },
              { icon: "pin" as const, text: "Пинск и район" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-2 rounded-xl border border-foreground/10 bg-surface px-3 py-2 text-xs sm:text-sm text-muted shadow-sm will-change-transform"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.75 + index * 0.1, ease: "easeOut" }}
                whileHover={shouldReduceMotion ? undefined : { y: -3, borderColor: "rgba(245,158,11,0.35)" }}
              >
                <LineIcon name={item.icon} className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{item.text}</span>
              </motion.div>
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
              className="relative bg-dark border border-foreground/10 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors cursor-pointer"
                aria-label="Закрыть"
              >
                <LineIcon name="close" className="w-5 h-5" />
              </button>

              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <LineIcon name="phone" className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-1">Позвоните нам</h3>
              <p className="text-muted text-sm mb-6">Работаем в Пинске и Пинском районе</p>

              <div className="flex flex-col gap-3">
                <a
                  href="tel:+375291645388"
                  className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-primary text-onPrimary font-semibold hover:bg-primary/90 transition-colors"
                >
                  <LineIcon name="phone" className="w-5 h-5 flex-shrink-0" />
                  +375 (29) 164-53-88
                </a>

                <a
                  href="viber://chat?number=%2B375291645388"
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
          className="w-0.5 h-8 bg-muted/40"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
