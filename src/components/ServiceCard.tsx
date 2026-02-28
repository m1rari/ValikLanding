// ============================================================
// КАРТОЧКА УСЛУГИ (ServiceCard)
// Переиспользуемый компонент — отображает одну услугу из массива services.ts.
// При наведении: карточка чуть увеличивается + появляется жёлтая полоска снизу.
// Все 8 карточек рендерятся через .map() в Services.tsx.
// ============================================================

"use client";

import { motion } from "framer-motion";
import { Service } from "@/data/services";

// Пропс — один объект услуги из массива services
interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    // motion.div — обычный div с анимацией Framer Motion
    // whileHover: при наведении карточка масштабируется и получает тень
    <motion.div
      className="group relative flex flex-col gap-4 p-6 rounded-2xl bg-surface border border-white/10 hover:border-primary/50 transition-colors duration-300 cursor-default"
      whileHover={{
        scale: 1.03,
        boxShadow: "0 8px 32px rgba(245, 166, 35, 0.15)", // Жёлтое свечение
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* ---- Иконка услуги ---- */}
      {/* Круглый жёлтый контейнер, SVG-строка вставляется через dangerouslySetInnerHTML */}
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
        <span
          className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: service.icon }}
        />
      </div>

      {/* ---- Текстовый блок ---- */}
      <div>
        {/* Заголовок — при наведении становится жёлтым */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>
        {/* Описание — серый мелкий текст */}
        <p className="text-muted text-sm leading-relaxed">{service.description}</p>
      </div>

      {/* ---- Декоративная линия снизу карточки ----
          Появляется только при наведении (opacity-0 → opacity-100) */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
