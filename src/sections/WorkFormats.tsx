// ============================================================
// СЕКЦИЯ: ФОРМАТЫ РАБОТЫ
// Объясняет пользователю два подхода к выполнению работ:
//   1. С проектом (для новостроек и капремонта)
//   2. Без проекта (для текущего ремонта)
// Реализованы в виде интерактивных вкладок (Tabs).
// Переключение вкладок анимируется через AnimatePresence (Framer Motion).
// ============================================================

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- Данные для двух вкладок ----
const tabs = [
  {
    id: "with-project",
    label: "С проектом",
    icon: "📐",
    // Данные для первой вкладки
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
    color: "from-electric/20 to-transparent",   // Цвет градиентного фона карточки
    accent: "text-electric border-electric/30", // Цвет акцентных элементов
  },
  {
    id: "without-project",
    label: "Без проекта",
    icon: "🔧",
    // Данные для второй вкладки
    title: "Работа без проекта",
    description:
      "Подходит для частичной замены проводки, переноса розеток и косметического ремонта. Минимум документов, максимум скорости.",
    features: [
      "Выезд на замер в день обращения",
      "Составление локальной сметы",
      "Быстрое согласование и старт работ",
      "Готовность без бюрократических задержек",
      "Подходит для съёмного жилья и офисов",
    ],
    badge: "Для текущего ремонта",
    color: "from-primary/20 to-transparent",   // Жёлтый градиент
    accent: "text-primary border-primary/30",  // Жёлтые акценты
  },
];

export default function WorkFormats() {
  // Хранит id активной вкладки; по умолчанию выбрана первая
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Находим объект активной вкладки из массива tabs
  const activeData = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="formats" className="section-padding bg-dark">
      <div className="container-custom">

        {/* ---- Заголовок секции ---- */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}           // Анимация срабатывает только один раз
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Как мы работаем
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            Форматы работы
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            Выберите удобный формат — работаем как по готовому проекту, так и без него
          </p>
        </motion.div>

        {/* ================================================================
            ПЕРЕКЛЮЧАТЕЛЬ ВКЛАДОК (Tab Bar)
            Горизонтальная строка с двумя кнопками.
            Активная кнопка выделяется жёлтым фоном.
            ================================================================ */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-1 p-1 bg-surface rounded-xl border border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2
                  ${activeTab === tab.id
                    ? "bg-primary text-dark shadow-lg shadow-primary/20"  // Активная вкладка
                    : "text-muted hover:text-white"                        // Неактивная вкладка
                  }
                `}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================
            КОНТЕНТ АКТИВНОЙ ВКЛАДКИ
            AnimatePresence позволяет плавно анимировать смену контента.
            mode="wait" — дожидается исчезновения старого контента перед
            появлением нового.
            ================================================================ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}           // При смене ключа React пересоздаёт компонент
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`
              max-w-3xl mx-auto p-8 rounded-2xl border
              bg-gradient-to-br ${activeData.color}
              border-white/5 relative overflow-hidden will-change-transform
            `}
          >
            {/* ---- Крупный SVG-значок в правом верхнем углу карточки ---- */}
            <div className={`absolute top-4 right-6 text-5xl opacity-20`}>
              {activeData.icon}
            </div>

            {/* ---- Бадж (тип работ) ---- */}
            <span
              className={`
                inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4
                ${activeData.accent}
              `}
            >
              {activeData.badge}
            </span>

            {/* ---- Заголовок вкладки ---- */}
            <h3 className="text-2xl font-bold mb-3">{activeData.title}</h3>

            {/* ---- Описание ---- */}
            <p className="text-muted mb-6 leading-relaxed">{activeData.description}</p>

            {/* ---- Список преимуществ ---- */}
            {/* Каждый пункт появляется с нарастающей задержкой (stagger) */}
            <ul className="space-y-3">
              {activeData.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }} // Нарастающий сдвиг по времени
                  className="flex items-center gap-3 text-sm"
                >
                  {/* Иконка-галочка */}
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-300">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
