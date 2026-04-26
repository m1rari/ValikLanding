                                                                                                                                                                                                                                                                                                                                                                                    "use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faqItems } from "@/data/faq";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="faq" className="section-padding bg-dark">
      <div className="container-custom">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Вопросы клиентов
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            Что важно знать перед вызовом электрика?
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            Короткие ответы по срокам, стоимости, договору, оплате и формату работы в Пинске и Пинском районе.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;

            return (
              <motion.article
                key={item.question}
                className="rounded-2xl border border-foreground/10 bg-surface overflow-hidden shadow-sm"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
                whileHover={shouldReduceMotion ? undefined : { borderColor: "rgba(245,158,11,0.32)" }}
              >
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 p-6 text-left cursor-pointer"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span className="text-lg font-semibold text-foreground">
                      {item.question}
                    </span>
                    <motion.span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.28,
                        ease: "easeInOut",
                      }}
                    >
                      <p className="px-6 pb-6 text-muted leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
