// ============================================================
// УТИЛИТА: ОТПРАВКА ЧЕРЕЗ EMAILJS
// Дублирует заявку из формы на email (резервный канал доставки).
//
// Настройка:
//   1. Зарегистрируйтесь на https://www.emailjs.com/
//   2. Создайте Email Service (например, Gmail) → получите EMAILJS_SERVICE_ID
//   3. Создайте Email Template → получите EMAILJS_TEMPLATE_ID
//   4. В разделе Account → API Keys скопируйте Public Key и Private Key
//   5. Запишите все 4 значения в .env.local
//
// Переменные окружения (.env.local):
//   EMAILJS_SERVICE_ID   — ID вашего подключённого почтового сервиса
//   EMAILJS_TEMPLATE_ID  — ID шаблона письма
//   EMAILJS_PUBLIC_KEY   — публичный ключ (для аутентификации)
//   EMAILJS_PRIVATE_KEY  — приватный ключ (только для серверной отправки)
// ============================================================

// Тип данных из формы
interface EmailPayload {
  name: string;     // Имя
  phone: string;    // Телефон
  message?: string; // Описание задачи
}

export async function sendEmail(data: EmailPayload): Promise<void> {
  // Читаем ключи из переменных окружения (заданы в .env.local)
  const serviceId  = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey  = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  // Если минимальные ключи не заданы — пропускаем отправку
  if (!serviceId || !templateId || !publicKey) {
    console.warn("EmailJS credentials not configured");
    return;
  }

  // Серверный endpoint EmailJS
  const url = "https://api.emailjs.com/api/v1.0/email/send";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  serviceId,
      template_id: templateId,
      user_id:     publicKey,
      accessToken: privateKey, // Для серверной отправки (необязательно на клиенте)

      // Параметры шаблона — имена должны совпадать с переменными в шаблоне EmailJS
      template_params: {
        from_name: data.name,
        phone:     data.phone,
        message:   data.message || "—",           // Дефис если задача не указана
        reply_to:  "noreply@electromaster.by",     // Адрес обратной отправки
      },
    }),
  });

  // Если EmailJS вернул ошибку — бросаем исключение
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`EmailJS API error: ${error}`);
  }
}
