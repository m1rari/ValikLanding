// ============================================================
// УТИЛИТА: ОТПРАВКА В TELEGRAM
// Отправляет данные из формы прямо в телеграм-бот владельца сайта.
//
// Настройка:
//   1. Создайте бота через @BotFather → получите TELEGRAM_BOT_TOKEN
//   2. Напишите боту что-нибудь, затем откройте:
//      https://api.telegram.org/bot<TOKEN>/getUpdates
//      Найдите "chat": { "id": ... } — это ваш TELEGRAM_CHAT_ID
//   3. Запишите оба значения в .env.local (не коммитьте их в git!)
// ============================================================

// Тип данных, которые приходят из формы
interface TelegramPayload {
  name: string;     // Имя отправителя
  phone: string;    // Телефон
  message?: string; // Описание задачи (необязательно)
}

export async function sendTelegram(data: TelegramPayload): Promise<void> {
  // Читаем секретные ключи из переменных окружения
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Если ключи не заданы — просто пропускаем отправку (не бросаем ошибку)
  if (!token || !chatId) {
    console.warn("Telegram credentials not configured");
    return;
  }

  // ---- Формируем текст сообщения ----
  // Markdown-форматирование: *жирный*, обычный текст
  const text = [
    "📞 *Новая заявка с сайта*",
    "",
    `👤 Имя: ${data.name}`,
    `📱 Телефон: ${data.phone}`,
    data.message ? `💬 Задача: ${data.message}` : null, // Показываем только если заполнено
    "",
    // Время в минском часовом поясе (UTC+3)
    `🕐 Время: ${new Date().toLocaleString("ru-BY", { timeZone: "Europe/Minsk" })}`,
  ]
    .filter(Boolean) // Убираем null-значения
    .join("\n");

  // URL Telegram Bot API для отправки сообщения
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown", // Включаем Markdown-форматирование
    }),
  });

  // Если Telegram API вернул ошибку — бросаем исключение
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }
}
