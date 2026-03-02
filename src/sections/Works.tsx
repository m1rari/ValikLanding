"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import { works } from "@/data/works";

// ---- Лайтбокс: полноэкранный просмотр одного фото ----
function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: typeof works;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Затемнение */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Стрелка влево */}
      <button
        onClick={onPrev}
        className="absolute left-3 sm:left-6 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary/80 border border-white/10 text-white transition-all duration-200 hover:scale-110"
        aria-label="Предыдущее фото"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Стрелка вправо */}
      <button
        onClick={onNext}
        className="absolute right-3 sm:right-6 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary/80 border border-white/10 text-white transition-all duration-200 hover:scale-110"
        aria-label="Следующее фото"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Кнопка закрытия */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-200"
        aria-label="Закрыть"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* Счётчик */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-black/50 border border-white/10 text-white text-sm font-medium">
        {index + 1} / {items.length}
      </div>

      {/* Фото */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="relative z-10 w-full max-w-5xl mx-6 aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.22 }}
        >
          <Image
            src={item.src}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
          {/* Подпись */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
            <p className="text-white font-semibold text-lg">{item.title}</p>
            <p className="text-white/60 text-sm">{item.category}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Точки-индикаторы */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); /* handled by parent */ }}
            className={`rounded-full transition-all duration-200 ${
              i === index ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-white/30"
            }`}
            aria-label={`Фото ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ---- Карточка фото в слайдере ----
function WorkCard({
  item,
  onClick,
}: {
  item: (typeof works)[0];
  onClick: () => void;
}) {
  return (
    <motion.button
      className="relative flex-shrink-0 w-72 sm:w-80 aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="320px"
      />

      {/* Оверлей при наведении */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Иконка лупы */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-onPrimary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
            <path d="M11 8v6M8 11h6"/>
          </svg>
        </div>
      </div>

      {/* Подпись */}
      <div className="absolute bottom-0 inset-x-0 p-4">
        <p className="text-white font-semibold text-sm leading-tight">{item.title}</p>
        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/80 text-onPrimary text-xs font-medium">
          {item.category}
        </span>
      </div>
    </motion.button>
  );
}

// ================================================================
// ГЛАВНАЯ СЕКЦИЯ: ПРИМЕРЫ РАБОТ
// ================================================================
export default function Works() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // motionValue для перетаскивания слайдера
  const x = useMotionValue(0);

  // Ограничения drag: не выходить за пределы трека
  const [dragConstraints, setDragConstraints] = useState<{ left: number; right: number }>({
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const trackWidth = track.scrollWidth;
      const visibleWidth = track.parentElement?.clientWidth ?? 0;
      const left = Math.min(0, visibleWidth - trackWidth);
      setDragConstraints({ left, right: 0 });
    };

    measure();
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Прокрутка на одну карточку кнопками
  const CARD_WIDTH = 336; // w-80 (320) + gap-4 (16)

  const scrollBy = (dir: 1 | -1) => {
    const next = Math.max(dragConstraints.left, Math.min(0, x.get() + dir * -CARD_WIDTH));
    animate(x, next, { type: "spring", stiffness: 200, damping: 30 });
  };

  // Лайтбокс navigation
  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = () =>
    setLightboxIndex((i) => (i != null ? (i - 1 + works.length) % works.length : null));
  const nextPhoto = () =>
    setLightboxIndex((i) => (i != null ? (i + 1) % works.length : null));

  // Клавиатурная навигация в лайтбоксе
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft")  prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "Escape")     closeLightbox();
    },
    [lightboxIndex]
  );

  return (
    <section
      id="works"
      className="section-padding bg-surface overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="container-custom">

        {/* Заголовок */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Наш опыт
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            Примеры работ
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            Реальные объекты в Пинске и Пинском районе — от замены проводки до монтажа под ключ
          </p>
        </motion.div>

        {/* Слайдер */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Кнопки навигации + трек */}
          <div className="relative">

            {/* Кнопка «назад» */}
            <button
              onClick={() => scrollBy(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-dark border border-foreground/10 shadow-lg flex items-center justify-center text-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 hidden sm:flex"
              aria-label="Назад"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {/* Кнопка «вперёд» */}
            <button
              onClick={() => scrollBy(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-dark border border-foreground/10 shadow-lg flex items-center justify-center text-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 hidden sm:flex"
              aria-label="Вперёд"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            {/* Маски по краям */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface to-transparent z-[5] pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface to-transparent z-[5] pointer-events-none" />

            {/* Область скролла */}
            <div className="overflow-hidden mx-1 py-2">
              <motion.div
                ref={trackRef}
                className="flex gap-4 cursor-grab active:cursor-grabbing will-change-transform"
                style={{ x }}
                drag="x"
                dragConstraints={dragConstraints}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                dragElastic={0.1}
                whileDrag={{ cursor: "grabbing" }}
              >
                {works.map((item, i) => (
                  <WorkCard
                    key={i}
                    item={item}
                    onClick={() => openLightbox(i)}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Подсказка (мобиль) */}
          <p className="text-center text-xs text-muted mt-4 sm:hidden">
            Листайте фото свайпом
          </p>
        </motion.div>

      </div>

      {/* Лайтбокс */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={works}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
