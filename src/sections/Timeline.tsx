"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: "phone",
    title: "Заявка",
    description: "Оставляете заявку на сайте или звоните. Договариваемся о времени выезда.",
  },
  {
    number: "02",
    icon: "measure",
    title: "Выезд и замер",
    description: "Бесплатный выезд мастера для оценки объёма работ в удобное для вас время.",
  },
  {
    number: "03",
    icon: "list",
    title: "Смета",
    description: "Составляем подробную смету. Работаем с проектом или без — на ваш выбор.",
  },
  {
    number: "04",
    icon: "tool",
    title: "Монтаж",
    description: "Выполняем работы в срок, соблюдая нормы ПУЭ. Убираем за собой мусор.",
  },
  {
    number: "05",
    icon: "check",
    title: "Сдача объекта",
    description: "Проверяем работу всех систем. Подписываем акт приёма-передачи и договор.",
  },
];

function StepIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
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
    case "measure":
      return (
        <svg {...common}>
          <path d="M4 18 18 4l2 2L6 20z" />
          <path d="m8 14 2 2" />
          <path d="m11 11 2 2" />
          <path d="m14 8 2 2" />
        </svg>
      );
    case "list":
      return (
        <svg {...common}>
          <path d="M8 6h13" />
          <path d="M8 12h13" />
          <path d="M8 18h13" />
          <path d="M3 6h.01" />
          <path d="M3 12h.01" />
          <path d="M3 18h.01" />
        </svg>
      );
    case "tool":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0 4.97 4.97L11 19.93a2.5 2.5 0 0 1-3.54-3.54l8.66-8.66a4 4 0 0 0-1.42-1.43Z" />
          <path d="m7 17 1 1" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
  }
}

export default function Timeline() {
  const lineRef = useRef(null);
  const isLineInView = useInView(lineRef, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="timeline" className="section-padding bg-dark overflow-hidden">
      <div className="container-custom">

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

        <div ref={lineRef} className="relative">

          {/* Горизонтальная линия (десктоп) */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5">
            <svg className="w-full h-full" viewBox="0 0 100 1" preserveAspectRatio="none">
              <motion.line
                x1="10" y1="0.5" x2="90" y2="0.5"
                stroke="currentColor"
                className="text-primary/60"
                strokeWidth="1"
                initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                animate={isLineInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="flex-1 flex flex-col md:items-center md:text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              >
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute left-7 top-16 bottom-0 w-0.5 bg-primary/30" />
                )}

                <div className="flex md:flex-col md:items-center gap-4 md:gap-0">
                  <motion.div
                    className="relative z-10 w-14 h-14 rounded-2xl bg-surface border border-primary/30 flex items-center justify-center text-primary flex-shrink-0 shadow-lg shadow-primary/10 will-change-transform"
                    initial={{ scale: shouldReduceMotion ? 1 : 0.86 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                      delay: index * 0.15 + 0.15,
                    }}
                    whileHover={shouldReduceMotion ? undefined : { y: -4, rotate: -2 }}
                  >
                    <motion.span
                      className="absolute inset-0 rounded-2xl bg-primary/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={
                        shouldReduceMotion
                          ? { opacity: 0, scale: 1 }
                          : { opacity: [0, 0.45, 0], scale: [0.8, 1.35, 1.6] }
                      }
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1.2, delay: index * 0.15 + 0.25, ease: "easeOut" }}
                    />
                    <span className="relative z-10">
                      <StepIcon name={step.icon} />
                    </span>
                  </motion.div>

                  <div className="md:mt-4">
                    <span className="text-primary text-xs font-bold tracking-widest block mb-1">
                      {step.number}
                    </span>
                    <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted text-sm leading-relaxed md:max-w-[160px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Акцентный блок */}
        <motion.div
          className="mt-16 p-6 rounded-3xl bg-surface border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="font-semibold text-foreground">Выезд на замер — бесплатно</p>
            <p className="text-muted text-sm mt-1">Консультация в день обращения</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Работаем по договору</p>
            <p className="text-muted text-sm mt-1">Все работы официально оформлены</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">Опыт с 2015 года</p>
            <p className="text-muted text-sm mt-1">Электромонтаж по нормам ПУЭ</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
