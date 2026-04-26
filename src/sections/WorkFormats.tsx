"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  {
    id: "with-project",
    label: "С проектом",
    icon: "plan",
    title: "Работа по проекту",
    description:
      "Идеальное решение для новостроек и капитального ремонта. Строгое следование инженерным чертежам, спецификациям и нормам ПУЭ.",
    features: [
      "Полное соответствие проектной документации",
      "Составление исполнительной схемы",
      "Согласование с контролирующими органами",
      "Соответствие нормам ПУЭ",
      "Приёмка и подключение Энергонадзором",
    ],
    badge: "Для новостроек и кап. ремонта",
    accent: "text-electric border-electric/30 bg-electric/10",
  },
  {
    id: "without-project",
    label: "Без проекта",
    icon: "tool",
    title: "Работа без проекта",
    description:
      "Подходит для частичной замены проводки, переноса розеток и косметического ремонта. Минимум документов, максимум скорости.",
    features: [
      "Консультация в день обращения",
      "Составление локальной сметы",
      "Быстрое согласование и старт работ",
      "Готовность без бюрократических задержек",
      "Подходит для съёмного жилья и офисов",
    ],
    badge: "Для текущего ремонта",
    accent: "text-primary border-primary/30 bg-primary/10",
  },
];

function FormatIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "plan") {
    return (
      <svg {...common}>
        <path d="M4 4h16v16H4z" />
        <path d="M8 4v16" />
        <path d="M4 9h16" />
        <path d="M12 14h5" />
        <path d="M12 17h3" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M14.7 6.3a4 4 0 0 0 4.97 4.97L11 19.93a2.5 2.5 0 0 1-3.54-3.54l8.66-8.66a4 4 0 0 0-1.42-1.43Z" />
      <path d="m7 17 1 1" />
    </svg>
  );
}

export default function WorkFormats() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeData = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="formats" className="section-padding bg-dark">
      <div className="container-custom">

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Как мы работаем
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            Подстроимся под ваш объект
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            Выберите удобный формат — работаем как по готовому проекту, так и без него
          </p>
        </motion.div>

        {/* Переключатель вкладок */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-1 p-1 bg-surface rounded-2xl border border-foreground/10 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer
                  ${activeTab === tab.id
                    ? "bg-primary text-onPrimary shadow-lg shadow-primary/20"
                    : "text-muted hover:text-foreground"
                  }
                `}
              >
                <FormatIcon name={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Контент вкладки */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`
              max-w-4xl mx-auto p-8 rounded-3xl border bg-surface
              border-foreground/10 relative overflow-hidden shadow-sm will-change-transform
            `}
          >
            <div className="absolute right-6 top-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-dark text-primary opacity-80">
              <FormatIcon name={activeData.icon} className="w-8 h-8" />
            </div>

            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${activeData.accent}`}>
              {activeData.badge}
            </span>

            <h3 className="text-2xl font-bold mb-3">{activeData.title}</h3>

            <p className="text-muted mb-6 leading-relaxed">{activeData.description}</p>

            <ul className="space-y-3">
              {activeData.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-foreground/80">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
