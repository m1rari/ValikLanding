// ============================================================
// СЕКЦИЯ: ГЛАВНЫЙ ЭКРАН (Hero)
// Первое, что видит пользователь. Занимает весь экран (min-h-screen).
// Содержит: бадж, H1-заголовок, подзаголовок, CTA-кнопки, доверительные метки.
// Все элементы появляются с задержкой (стаггер) через функцию fadeInUp.
// ============================================================

"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

// ---- Фабрика анимации «появление снизу» ----
// Принимает delay (секунды) и возвращает объект пропсов для motion-элемента.
// Используем as const для корректной типизации ease в TypeScript.
function fadeInUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  };
}

export default function Hero() {
  // Вспомогательная функция: плавный скролл к якорной секции
  const handleScrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ================================================================
          ФОН СЕКЦИИ
          Несколько слоёв, наложенных друг на друга (z-index = 0)
          ================================================================ */}
      <div className="absolute inset-0 z-0">
        {/* Тёмный градиент — основной фон */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0d14] via-[#0F1117] to-[#111827]" />

        {/* Паттерн электросхемы — очень слабый (opacity: 5%) */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5A623' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Радиальное жёлтое свечение по центру */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,rgba(245,166,35,0.08),transparent)]" />

        {/* Затемнение снизу — плавный переход к следующей секции */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-dark to-transparent" />
      </div>

      {/* ================================================================
          АНИМИРОВАННЫЕ ЧАСТИЦЫ
          6 маленьких жёлтых точек, медленно «плавают» вверх-вниз
          ================================================================ */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5, // Каждая частица движется с разной скоростью
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}

      {/* ================================================================
          ОСНОВНОЙ КОНТЕНТ
          Располагается поверх фона (z-index: 10)
          ================================================================ */}
      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="max-w-3xl">

          {/* ---- Бадж «Выезд мастера в день обращения» ---- */}
          {/* Появляется первым (delay: 0) */}
          <motion.div
            {...fadeInUp(0)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> {/* Мигающая точка */}
            Выезд мастера в день обращения
          </motion.div>

          {/* ---- Главный заголовок H1 ---- */}
          {/* «электромонтажных» выделено жёлтым градиентом */}
          <motion.h1
            {...fadeInUp(0.15)}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            Комплекс{" "}
            <span className="text-gradient">электромонтажных</span>{" "}
            работ в частном доме, квартире или офисе
          </motion.h1>

          {/* ---- Подзаголовок ---- */}
          <motion.p
            {...fadeInUp(0.3)}
            className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
          >
            Надёжно, по стандартам.{" "}
            <span className="text-white font-medium">Выезд мастера в день обращения.</span>{" "}
            Работаем в Пинске и Пинском районе.
          </motion.p>

          {/* ---- CTA-кнопки ---- */}
          {/* «Вызвать мастера» — основная, с пульсацией; «Рассчитать стоимость» — контурная */}
          <motion.div
            {...fadeInUp(0.45)}
            className="flex flex-wrap gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              pulse                                   // Включаем пульсирующую анимацию
              onClick={() => handleScrollTo("#contacts")}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Вызвать мастера
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleScrollTo("#contacts")}
            >
              Рассчитать стоимость
            </Button>
          </motion.div>

          {/* ---- Метки доверия ---- */}
          {/* Мелкие подсказки под кнопками: договор, опыт, регион */}
          <motion.div
            {...fadeInUp(0.6)}
            className="flex flex-wrap gap-6 mt-12"
          >
            {[
              { icon: "📋", text: "Официальный договор"         },
              { icon: "⚡", text: "Работаем с 2015 года"        },
              { icon: "📍", text: "Пинск и Пинский район"       },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-gray-400">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ---- Индикатор прокрутки вниз ---- */}
      {/* Появляется через 1.5 секунды после загрузки страницы */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span>Прокрутите вниз</span>
        {/* Анимированная вертикальная линия */}
        <motion.div
          className="w-0.5 h-8 bg-gradient-to-b from-muted to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
