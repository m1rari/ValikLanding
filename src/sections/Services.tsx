// ============================================================
// СЕКЦИЯ: НАШИ УСЛУГИ
// Отображает сетку из 8 карточек услуг.
// Карточки подгружаются из массива данных (src/data/services.ts)
// и рендерятся через ServiceCard.
// При прокрутке до секции карточки появляются поочерёдно
// с нарастающей задержкой — «stagger effect» (Framer Motion whileInView).
// ============================================================

"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
import ServiceCard from "@/components/ServiceCard";

export default function Services() {
  return (
    <section id="services" className="section-padding bg-surface">
      <div className="container-custom">

        {/* ---- Заголовок секции ---- */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Что мы делаем
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            Наши услуги
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            Полный комплекс электромонтажных работ — от замены проводки до монтажа системы умного дома
          </p>
        </motion.div>

        {/* ================================================================
            СЕТКА КАРТОЧЕК
            Каждая карточка анимируется самостоятельно через whileInView.
            delay рассчитывается по индексу для stagger-эффекта.
            ================================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              // Каждая карточка «вылетает» снизу по очереди
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08, // Нарастающая задержка: 0, 0.08, 0.16, 0.24...
                ease: "easeOut",
              }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
