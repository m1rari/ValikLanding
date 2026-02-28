// ============================================================
// СЕКЦИЯ: ФОРМА ЗАХВАТА (Lead Form)
// Основной конверсионный блок сайта.
// Содержит поля: Имя, Телефон, Описание задачи (опционально),
// чекбокс согласия на обработку персональных данных.
// Валидация: react-hook-form + кастомная проверка белорусского телефона.
// После отправки форма уходит в состояния loading → success / error.
// Данные отправляются на /api/contact (Telegram + EmailJS).
// ============================================================

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// ---- Типизация данных формы ----
interface FormData {
  name: string;
  phone: string;
  message?: string;
  consent: boolean;
}

export default function LeadForm() {
  // Состояние отправки: idle | loading | success | error
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // ---- React Hook Form ----
  const {
    register,      // Регистрирует поле и подключает валидацию
    handleSubmit,  // Обёртка над onSubmit: сначала валидирует, потом вызывает коллбэк
    formState: { errors },  // Объект с ошибками валидации
    reset,         // Сбрасывает форму в исходное состояние
  } = useForm<FormData>();

  // ---- Обработчик отправки ----
  const onSubmit = async (data: FormData) => {
    setSubmitStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Ошибка отправки");
      setSubmitStatus("success");
      reset();  // Очищаем поля после успешной отправки
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <section id="contacts" className="section-padding bg-surface">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">

          {/* ---- Заголовок и подзаголовок ---- */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Бесплатная консультация
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Оставьте заявку
            </h2>
            <p className="text-muted mt-4">
                  Работаем в Пинске и Пинском районе. Перезвоним в течение 15 минут.
            </p>
          </motion.div>

          {/* ================================================================
              КАРТОЧКА ФОРМЫ
              Тёмный фон + жёлтая рамка + скруглённые углы
              ================================================================ */}
          <motion.div
            className="bg-dark rounded-2xl p-8 border border-primary/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >

            {/* ==============================================================
                СОСТОЯНИЕ: УСПЕШНАЯ ОТПРАВКА
                Отображается вместо формы после успешного submit
                ============================================================== */}
            {submitStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
                <p className="text-muted mb-6">Перезвоним в течение 15 минут</p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitStatus("idle")}
                >
                  Отправить ещё одну заявку
                </Button>
              </motion.div>

            ) : (
              /* ==============================================================
                 ФОРМА
                 Три поля + чекбокс + кнопка отправки
                 ============================================================== */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* ---- Поле: Имя ---- */}
                <div>
                  <Input
                    placeholder="Ваше имя"
                    {...register("name", { required: "Введите ваше имя" })}
                    error={errors.name?.message}
                  />
                </div>

                {/* ---- Поле: Телефон ---- */}
                {/* Кастомная валидация: белорусский формат +375 XX XXX-XX-XX */}
                <div>
                  <Input
                    placeholder="+375 XX XXX-XX-XX"
                    type="tel"
                    {...register("phone", {
                      required: "Введите номер телефона",
                      validate: (value) => {
                        // Удаляем все нецифровые символы и проверяем длину
                        const digits = value.replace(/\D/g, "");
                        return (
                          (digits.length === 12 && digits.startsWith("375")) ||
                          "Введите корректный номер (+375 XX XXX-XX-XX)"
                        );
                      },
                    })}
                    error={errors.phone?.message}
                  />
                </div>

                {/* ---- Поле: Описание задачи (необязательное) ---- */}
                <div>
                  <textarea
                    placeholder="Кратко опишите задачу (необязательно)"
                    rows={3}
                    {...register("message")}
                    className="w-full px-4 py-3 bg-surface rounded-xl border border-white/10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                {/* ---- Чекбокс согласия на обработку персональных данных ---- */}
                {/* Обязательное поле согласно законодательству РБ */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("consent", {
                        required: "Необходимо согласие на обработку данных",
                      })}
                      className="mt-1 w-4 h-4 accent-primary flex-shrink-0"
                    />
                    <span className="text-sm text-muted">
                      Я согласен(на) на обработку персональных данных в соответствии
                      с{" "}
                      <a href="#" className="text-primary hover:underline">
                        политикой конфиденциальности
                      </a>
                    </span>
                  </label>
                  {/* Сообщение об ошибке чекбокса */}
                  {errors.consent && (
                    <p className="text-red-400 text-sm mt-1">{errors.consent.message}</p>
                  )}
                </div>

                {/* ---- Кнопка отправки / индикатор загрузки ---- */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  type="submit"
                  disabled={submitStatus === "loading"}
                >
                  {submitStatus === "loading" ? (
                    // Индикатор загрузки во время отправки
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Отправляем...
                    </span>
                  ) : (
                    "Отправить заявку"
                  )}
                </Button>

                {/* ---- Сообщение об ошибке отправки ---- */}
                {submitStatus === "error" && (
                  <p className="text-red-400 text-sm text-center">
                    Ошибка отправки. Позвоните нам:{" "}
                    <a href="tel:+375291645388" className="text-primary hover:underline font-semibold">
                      +375 (29) 164-53-88
                    </a>
                  </p>
                )}
              </form>
            )}

          </motion.div>

          {/* ---- Альтернативные способы связи ---- */}
          {/* Под формой — телефон, Viber и Telegram */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <a href="tel:+375291645388" className="flex items-center gap-2 hover:text-primary transition-colors">
              <span>📞</span>
              +375 (29) 164-53-88
            </a>
            <a href="viber://chat?number=375291645388" className="flex items-center gap-2 hover:text-primary transition-colors">
              <span>💬</span>
              Viber
            </a>
            <a href="https://t.me/+375291645388" className="flex items-center gap-2 hover:text-primary transition-colors">
              <span>✈️</span>
              Telegram
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
