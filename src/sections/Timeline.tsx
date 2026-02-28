// ============================================================
// СЕКЦИЯ: ЭТАПЫ РАБОТЫ (Таймлайн)
// Показывает пошаговый процесс сотрудничества — от заявки до сдачи объекта.
// На десктопе шаги отображаются горизонтально,
// на мобильных — вертикально (вертикальная линия слева).
// Анимация каждого шага запускается через whileInView при прокрутке.
// ============================================================

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ---- Данные этапов ----
// Каждый этап содержит: номер, иконку, заголовок и краткое описание
const steps = [
  {
    number: "01",
    icon: "📞",
    title: "Заявка",
    description: "Оставляете заявку на сайте или звоните. Договариваемся о времени выезда.",
  },
  {
    number: "02",
    icon: "📏",
    title: "Выезд и замер",
    description: "Бесплатный выезд мастера для оценки объёма работ в удобное для вас время.",
  },
  {
    number: "03",
    icon: "📋",
    title: "Смета",
    description: "Составляем подробную смету. Работаем с проектом или без — на ваш выбор.",
  },
  {
    number: "04",
    icon: "🔨",
    title: "Монтаж",
    description: "Выполняем работы в срок, соблюдая нормы ПУЭ. Убираем за собой мусор.",
  },
  {
    number: "05",
    icon: "✅",
    title: "Сдача объекта",
    description: "Проверяем работу всех систем. Подписываем акт приёма-передачи и договор.",
  },
];

export default function Timeline() {
  // ref для SVG-линии — анимируем pathLength когда секция в поле зрения
  const lineRef = useRef(null);
  const isLineInView = useInView(lineRef, { once: true, amount: 0.3 });

  return (
    <section id="timeline" className="section-padding bg-dark overflow-hidden">
      <div className="container-custom">

        {/* ---- Заголовок секции ---- */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Прозрачность процесса
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            Этапы работы
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            Знаем, что вам важно понимать, что происходит на каждом шаге
          </p>
        </motion.div>

        {/* ================================================================
            КОНТЕЙНЕР ТАЙМЛАЙНА
            Относительное позиционирование нужно для
            абсолютно спозиционированной горизонтальной/вертикальной линии.
            ================================================================ */}
        <div ref={lineRef} className="relative">

          {/* ---- Горизонтальная соединительная линия (только десктоп) ---- */}
          {/* Анимирует pathLength SVG при попадании секции в viewport */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5">
            <svg className="w-full h-full" viewBox="0 0 100 1" preserveAspectRatio="none">
              <motion.line
                x1="10" y1="0.5" x2="90" y2="0.5"
                stroke="url(#lineGradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={isLineInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                vectorEffect="non-scaling-stroke"
              />
              <defs>
                {/* Градиент линии: прозрачный → жёлтый → прозрачный */}
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#F5A623" stopOpacity="0"   />
                  <stop offset="50%"  stopColor="#F5A623" stopOpacity="1"   />
                  <stop offset="100%" stopColor="#F5A623" stopOpacity="0"   />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* ---- Список шагов ---- */}
          {/* На мобильных — flex-col (вертикально), на десктопе — flex-row */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="flex-1 flex flex-col md:items-center md:text-center relative"
                // Каждый шаг появляется снизу с нарастающей задержкой
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
              >
                {/* ---- Мобильная вертикальная линия между шагами ---- */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute left-7 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
                )}

                {/* ---- Иконка шага ---- */}
                <div className="flex md:flex-col md:items-center gap-4 md:gap-0">
                  <div className="relative z-10 w-14 h-14 rounded-full bg-surface border-2 border-primary/30 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-primary/10">
                    {step.icon}
                  </div>

                  {/* ---- Текст шага ---- */}
                  <div className="md:mt-4">
                    {/* Номер шага (00N, маленький, жёлтый) */}
                    <span className="text-primary text-xs font-bold tracking-widest block mb-1">
                      {step.number}
                    </span>
                    <h3 className="font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-muted text-sm leading-relaxed md:max-w-[160px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ---- Акцентный блок под таймлайном ---- */}
        {/* Краткое резюме: гарантия + бесплатный выезд */}
        <motion.div
          className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-electric/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="font-semibold text-white">Выезд на замер — бесплатно</p>
            <p className="text-muted text-sm mt-1">В день обращения по Пинску и Пинскому р-ну</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-white">Работаем по договору</p>
            <p className="text-muted text-sm mt-1">Все работы официально оформлены</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-white">Опыт с 2015 года</p>
            <p className="text-muted text-sm mt-1">Электромонтаж по нормам ПУЭ</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
