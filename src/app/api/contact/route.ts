// ============================================================
// API-МАРШРУТ: /api/contact  (метод POST)
// Серверный обработчик заявок с формы.
// Принимает JSON { name, phone, message?, consent },
// валидирует данные и дублирует отправку в двух каналах:
//   1. Telegram-бот (мгновенное уведомление в телефон)
//   2. EmailJS (письмо на email — резервный канал)
// Если хотя бы один канал доставил — возвращаем { ok: true }.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { sendTelegram } from "@/utils/sendTelegram";
import { sendEmail }    from "@/utils/sendEmail";

// Тип тела запроса от фронтенда
interface ContactBody {
  name:     string;
  phone:    string;
  message?: string;
  consent:  boolean; // Обязательное согласие на обработку персональных данных
}

// ---- Регулярное выражение для белорусского номера телефона ----
// Допустимые форматы: +375 (29) 164-53-88 | +375291645388 | +375 29 164 53 88
const PHONE_REGEX = /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;

export async function POST(req: NextRequest) {
  try {
    // ---- Парсинг тела запроса ----
    const body: ContactBody = await req.json();
    const { name, phone, message, consent } = body;

    // ---- Серверная валидация ----
    // (Дублирует клиентскую валидацию react-hook-form — нельзя обойти через DevTools)

    // Имя: минимум 2 символа
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Некорректное имя" }, { status: 400 });
    }

    // Телефон: должен соответствовать белорусскому формату
    if (!phone || !PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { error: "Некорректный номер телефона" },
        { status: 400 }
      );
    }

    // Согласие на обработку персональных данных: обязательно по законодательству РБ
    if (!consent) {
      return NextResponse.json(
        { error: "Необходимо согласие на обработку данных" },
        { status: 400 }
      );
    }

    // ---- Подготовка данных для отправки ----
    const payload = {
      name:    name.trim(),
      phone:   phone.trim(),
      message: message?.trim(),
    };

    // ---- Параллельная отправка в оба канала ----
    // Promise.allSettled — не прерывается при ошибке одного канала
    const results = await Promise.allSettled([
      sendTelegram(payload), // Канал 1: Telegram
      sendEmail(payload),    // Канал 2: EmailJS
    ]);

    // ---- Логирование частичных сбоев ----
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(
          `Delivery channel ${i === 0 ? "Telegram" : "EmailJS"} failed:`,
          result.reason
        );
      }
    });

    // ---- Проверка: хотя бы один канал успешен ----
    const anySuccess = results.some((r) => r.status === "fulfilled");
    if (!anySuccess) {
      return NextResponse.json(
        { error: "Не удалось отправить заявку. Попробуйте позвонить." },
        { status: 502 }
      );
    }

    // Оба (или хотя бы один) канала отработали — успех
    return NextResponse.json({ ok: true });

  } catch (err) {
    // Непредвиденная ошибка сервера
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
