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
//
// Если с сервера нет прямого доступа до api.telegram.org (блокировка и т.п.):
//   • TELEGRAM_HTTP_PROXY=http://user:pass@хост:порт — свой HTTP-прокси (приоритетнее), или
//   • TELEGRAM_USE_PROXIFLY=true и опционально PROXIFLY_API_KEY — HTTP API api.proxifly.dev (без npm-пакета).
// ============================================================

import { ProxyAgent, fetch as undiciFetch } from "undici";

const PROXIFLY_CACHE_MS = 5 * 60 * 1000;
let proxiflyProxyCache: { url: string; until: number } | null = null;

function proxiflyEnabled(): boolean {
  const v = process.env.TELEGRAM_USE_PROXIFLY?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function extractHttpProxyUrl(raw: unknown): string | null {
  if (raw == null) return null;
  if (Array.isArray(raw)) return extractHttpProxyUrl(raw[0]);
  if (typeof raw !== "object") return null;
  const p = (raw as { proxy?: unknown }).proxy;
  if (typeof p !== "string") return null;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return null;
}

/** Прямой запрос к api.proxifly.dev: пакет proxifly падает на пустом/битом JSON от API. */
async function fetchProxiflyHttpProxyUrl(): Promise<string> {
  const params = new URLSearchParams({
    format: "json",
    protocol: "http",
    quantity: "1",
  });
  const country = process.env.PROXIFLY_PROXY_COUNTRY?.trim();
  if (country) params.set("country", country);

  const apiUrl = `https://api.proxifly.dev/proxy?${params.toString()}`;
  const apiKey = process.env.PROXIFLY_API_KEY?.trim();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  let lastMessage = "Proxifly: не удалось получить прокси";
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 400 * attempt));
    let res: Awaited<ReturnType<typeof undiciFetch>>;
    try {
      res = await undiciFetch(apiUrl, {
        headers,
        signal: AbortSignal.timeout(45_000),
      });
    } catch (e) {
      lastMessage = `Proxifly: ${e instanceof Error ? e.message : String(e)}`;
      continue;
    }
    const text = await res.text();
    if (!res.ok) {
      lastMessage = `Proxifly HTTP ${res.status}: ${text.slice(0, 200)}`;
      continue;
    }
    const trimmed = text.trim();
    if (!trimmed) {
      lastMessage = "Proxifly: пустой ответ";
      continue;
    }
    let raw: unknown;
    try {
      raw = JSON.parse(trimmed);
    } catch {
      lastMessage = `Proxifly: не JSON (${trimmed.slice(0, 100)})`;
      continue;
    }
    const proxyUrl = extractHttpProxyUrl(raw);
    if (proxyUrl) return proxyUrl;
    lastMessage = "Proxifly: в ответе нет HTTP(S)-прокси";
  }
  throw new Error(lastMessage);
}

/** Статический прокси из .env или кэшированный URL от Proxifly. */
async function resolveTelegramOutboundProxyUrl(): Promise<string | undefined> {
  const manual = process.env.TELEGRAM_HTTP_PROXY?.trim();
  if (manual) return manual;

  if (!proxiflyEnabled()) return undefined;

  const now = Date.now();
  if (proxiflyProxyCache && proxiflyProxyCache.until > now) {
    return proxiflyProxyCache.url;
  }

  const url = await fetchProxiflyHttpProxyUrl();
  proxiflyProxyCache = { url, until: now + PROXIFLY_CACHE_MS };
  return url;
}

interface TelegramPayload {
  name:             string;
  phone:            string;
  wallMaterial?:    string;
  mountingMethod?:  string;
  connectionPoints?: number;
  message?:         string;
}

export async function sendTelegram(data: TelegramPayload): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
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

  const body = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  });

  const useProxifly = proxiflyEnabled() && !process.env.TELEGRAM_HTTP_PROXY?.trim();
  const maxAttempts = useProxifly ? 2 : 1;

  let response!: Awaited<ReturnType<typeof undiciFetch>>;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const proxyUrl = await resolveTelegramOutboundProxyUrl();
    try {
      response = await undiciFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        ...(proxyUrl ? { dispatcher: new ProxyAgent(proxyUrl) } : {}),
      });
      break;
    } catch (err) {
      if (useProxifly && attempt < maxAttempts - 1) {
        proxiflyProxyCache = null;
        continue;
      }
      throw err;
    }
  }

  // Если Telegram API вернул ошибку — бросаем исключение
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }
}
