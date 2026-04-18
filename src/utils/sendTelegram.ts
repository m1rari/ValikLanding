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

interface TelegramPayload {
  name:             string;
  phone:            string;
  wallMaterial?:    string;
  mountingMethod?:  string;
  connectionPoints?: number;
  message?:         string;
}

export async function sendTelegram(data: TelegramPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID || "")
    .split(/[,\s;]+/)
    .map((id: string) => id.trim())
    .filter(Boolean)
    .filter((id: string, index: number, arr: string[]) => arr.indexOf(id) === index);

  if (!token || chatIds.length === 0) {
    console.warn("Telegram credentials not configured");
    return;
  }

  const text = [
    "📋 *Новая заявка с сайта*",
    "",
    `👤 Имя: ${data.name}`,
    `📱 Телефон: ${data.phone}`,
    data.wallMaterial    ? `🧱 Материал стен: ${data.wallMaterial}`                              : null,
    data.mountingMethod  ? `🔧 Способ монтажа: ${data.mountingMethod}`                           : null,
    data.connectionPoints != null ? `🔌 Точки подключения: ${data.connectionPoints} шт.`         : null,
    data.message         ? `💬 Комментарий: ${data.message}`                                     : null,
    "",
    `🕐 Время: ${new Date().toLocaleString("ru-BY", { timeZone: "Europe/Minsk" })}`,
  ]
    .filter(Boolean)
    .join("\n");

  // URL Telegram Bot API для отправки сообщения
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const results = await Promise.allSettled(
    chatIds.map(async (chatId: string) => {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown", // Включаем Markdown-форматирование
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`chat_id=${chatId}: ${error}`);
      }
    })
  );

  const successful = results.some((result: PromiseSettledResult<void>) => result.status === "fulfilled");
  if (!successful) {
    const errors = results
      .filter(
        (result: PromiseSettledResult<void>): result is PromiseRejectedResult => result.status === "rejected"
      )
      .map((result: PromiseRejectedResult) => String(result.reason))
      .join("; ");
    throw new Error(`Telegram API error for all chats: ${errors}`);
  }
}
