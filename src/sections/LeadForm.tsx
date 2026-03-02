"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Форматирует строку в маску +375 (XX) XXX-XX-XX по мере ввода.
// Принимает любой ввод, извлекает только цифры, нормализует 375-префикс.
function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  // Нормализуем: убираем лишние 375 в начале, если пользователь вставил готовый номер
  if (digits.length > 3 && digits.startsWith("375375")) {
    digits = digits.slice(3);
  }
  // Всегда начинаем с 375
  if (!digits.startsWith("375")) {
    digits = "375" + digits.replace(/^375/, "");
  }
  // Ограничиваем 12 цифрами: 375 + 9 (оператор + номер)
  digits = digits.slice(0, 12);

  const local = digits.slice(3); // цифры после 375

  if (local.length === 0) return "+375 (";
  if (local.length <= 2)  return `+375 (${local}`;
  if (local.length <= 5)  return `+375 (${local.slice(0, 2)}) ${local.slice(2)}`;
  if (local.length <= 7)  return `+375 (${local.slice(0, 2)}) ${local.slice(2, 5)}-${local.slice(5)}`;
  return `+375 (${local.slice(0, 2)}) ${local.slice(2, 5)}-${local.slice(5, 7)}-${local.slice(7, 9)}`;
}

type WallMaterial = "дерево" | "кирпич" | "пеноблок" | "бетон";
type MountingMethod = "открытый" | "скрытый";

interface FormData {
  name: string;
  phone: string;
  wallMaterial: WallMaterial;
  mountingMethod: MountingMethod;
  connectionPoints: number;
  consent: boolean;
}

const WALL_MATERIALS: { value: WallMaterial; label: string; icon: string }[] = [
  { value: "дерево",   label: "Дерево",   icon: "🪵" },
  { value: "кирпич",  label: "Кирпич",   icon: "🧱" },
  { value: "пеноблок", label: "Пеноблок", icon: "⬜" },
  { value: "бетон",   label: "Бетон",    icon: "🏗️" },
];

const MOUNTING_METHODS: { value: MountingMethod; label: string; desc: string }[] = [
  { value: "открытый", label: "Открытый", desc: "кабель в кабель-канале" },
  { value: "скрытый",  label: "Скрытый",  desc: "кабель в стене" },
];

export default function LeadForm() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<FormData>({
    defaultValues: { connectionPoints: 1 },
  });

  const selectedMaterial = watch("wallMaterial");
  const selectedMethod   = watch("mountingMethod");

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
      reset();
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <section id="contacts" className="section-padding bg-surface">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">

          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Бесплатный расчёт
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Оставить заявку
            </h2>
            <p className="text-muted mt-4">
              Ответьте на несколько вопросов — перезвоним с точной ценой в течение 15 минут.
            </p>
          </motion.div>

          <motion.div
            className="bg-dark rounded-2xl p-8 border border-primary/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >

            {submitStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
                <p className="text-muted mb-6">Перезвоним в течение 15 минут</p>
                <Button variant="outline" onClick={() => setSubmitStatus("idle")}>
                  Отправить ещё одну заявку
                </Button>
              </motion.div>

            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

                {/* ---- Шаг 1: Материал стен ---- */}
                <div>
                  <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">
                    1. Материал стен
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {WALL_MATERIALS.map(({ value, label, icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue("wallMaterial", value, { shouldValidate: true })}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                          selectedMaterial === value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-foreground/10 bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
                        }`}
                      >
                        <span className="text-xl">{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                  {/* Скрытый input для валидации */}
                  <input
                    type="hidden"
                    {...register("wallMaterial", { required: "Выберите материал стен" })}
                  />
                  {errors.wallMaterial && (
                    <p className="text-red-400 text-sm mt-2">{errors.wallMaterial.message}</p>
                  )}
                </div>

                {/* ---- Шаг 2: Способ монтажа ---- */}
                <div>
                  <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">
                    2. Способ монтажа
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {MOUNTING_METHODS.map(({ value, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue("mountingMethod", value, { shouldValidate: true })}
                        className={`flex flex-col items-start gap-0.5 py-3 px-4 rounded-xl border text-sm transition-all ${
                          selectedMethod === value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-foreground/10 bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
                        }`}
                      >
                        <span className="font-semibold">{label}</span>
                        <span className={`text-xs ${selectedMethod === value ? "text-primary/70" : "text-muted/70"}`}>
                          {desc}
                        </span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    {...register("mountingMethod", { required: "Выберите способ монтажа" })}
                  />
                  {errors.mountingMethod && (
                    <p className="text-red-400 text-sm mt-2">{errors.mountingMethod.message}</p>
                  )}
                </div>

                {/* ---- Шаг 3: Количество точек подключения ---- */}
                <div>
                  <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">
                    3. Точки подключения
                  </p>
                  <p className="text-xs text-muted mb-3">Сколько розеток и выключателей нужно установить?</p>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        const v = Number(watch("connectionPoints")) || 1;
                        if (v > 1) setValue("connectionPoints", v - 1);
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-foreground/10 bg-surface text-foreground text-xl hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      {...register("connectionPoints", {
                        required: "Укажите количество",
                        min: { value: 1, message: "Минимум 1" },
                        max: { value: 999, message: "Не более 999" },
                        valueAsNumber: true,
                      })}
                      className="w-24 text-center px-4 py-3 bg-surface rounded-xl border border-foreground/10 text-foreground focus:outline-none focus:border-primary/50 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const v = Number(watch("connectionPoints")) || 0;
                        if (v < 999) setValue("connectionPoints", v + 1);
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-foreground/10 bg-surface text-foreground text-xl hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      +
                    </button>
                    <span className="text-muted text-sm">шт.</span>
                  </div>
                  {errors.connectionPoints && (
                    <p className="text-red-400 text-sm mt-2">{errors.connectionPoints.message}</p>
                  )}
                </div>

                {/* ---- Контактные данные ---- */}
                <div className="pt-2 border-t border-foreground/5 space-y-4">
                  <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">
                    Ваши контакты
                  </p>

                  <Input
                    placeholder="Ваше имя"
                    {...register("name", { required: "Введите ваше имя" })}
                    error={errors.name?.message}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Введите номер телефона",
                      validate: (value) => {
                        const digits = (value ?? "").replace(/\D/g, "");
                        return (
                          (digits.length === 12 && digits.startsWith("375")) ||
                          "Введите полный номер: +375 (XX) XXX-XX-XX"
                        );
                      },
                    }}
                    render={({ field: { onChange, value, ref } }) => (
                      <Input
                        ref={ref}
                        type="tel"
                        inputMode="numeric"
                        placeholder="+375 (XX) XXX-XX-XX"
                        value={value ?? ""}
                        onFocus={(e) => {
                          if (!e.target.value) onChange("+375 (");
                        }}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          onChange(formatted);
                        }}
                        error={errors.phone?.message}
                      />
                    )}
                  />
                </div>

                {/* ---- Согласие ---- */}
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
                  {errors.consent && (
                    <p className="text-red-400 text-sm mt-1">{errors.consent.message}</p>
                  )}
                </div>

                {/* ---- Кнопка отправки ---- */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  type="submit"
                  disabled={submitStatus === "loading"}
                >
                  {submitStatus === "loading" ? (
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
            <a href="viber://chat?number=%2B375291645388" className="flex items-center gap-2 hover:text-primary transition-colors">
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
