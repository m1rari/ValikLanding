/**
 * Telegram Admin Bot — управление сервером и приложением из Telegram.
 * Отвечает только на сообщения из чата с ADMIN_CHAT_ID.
 *
 * Кнопки: Статус сервера, Статус приложения, Перезапуск приложения, Обновить приложение, Перезапуск сервера.
 */

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { exec } = require("child_process");
const { promisify } = require("util");
const path = require("path");

const execAsync = promisify(exec);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const APP_DIR = process.env.APP_DIR || "/var/www/ValikLanding";
const PM2_APP_NAME = process.env.PM2_APP_NAME || "all";
const BUILD_SCRIPT = process.env.BUILD_SCRIPT || "build";

if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
  console.error("Set TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID (or TELEGRAM_CHAT_ID) in .env");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, {
  polling: {
    params: { allowed_updates: ["message", "callback_query"] },
  },
});

function isAdmin(chatId) {
  const id = String(chatId);
  const allowed = String(ADMIN_CHAT_ID).trim();
  return id === allowed;
}

function escapeMarkdown(text) {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

function codeBlock(text) {
  const maxLen = 3800;
  const out = String(text).replace(/`/g, "`\u200b");
  return out.length > maxLen ? out.slice(0, maxLen) + "…" : out;
}

async function runCommand(cmd, options = {}) {
  const { timeout = 60000, cwd } = options;
  try {
    const { stdout, stderr } = await execAsync(cmd, {
      timeout,
      maxBuffer: 1024 * 1024,
      cwd: cwd || undefined,
    });
    const out = [stdout, stderr].filter(Boolean).join("\n").trim();
    return { ok: true, out: out || "(пусто)" };
  } catch (err) {
    const out = [err.stdout, err.stderr].filter(Boolean).join("\n").trim() || err.message;
    return { ok: false, out: out || String(err) };
  }
}

// ——— Клавиатура с кнопками ———
function getMainKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🖥 Статус сервера", callback_data: "status_server" },
          { text: "📦 Статус приложения", callback_data: "status_app" },
        ],
        [
          { text: "🔄 Перезапуск приложения", callback_data: "restart_app" },
          { text: "⬆️ Обновить приложение", callback_data: "update_app" },
        ],
        [{ text: "🔴 Перезапуск сервера", callback_data: "restart_server" }],
      ],
    },
  };
}

// ——— Обработка только от админа ———
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (!isAdmin(chatId)) return;

  const text = (msg.text || "").trim().toLowerCase();
  if (text === "/start" || text === "/menu" || text === "меню") {
    bot.sendMessage(
      chatId,
      "⚙️ *Управление сервером*\n\nВыберите действие:",
      { parse_mode: "Markdown", ...getMainKeyboard() }
    );
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  if (!isAdmin(chatId)) {
    bot.answerCallbackQuery(query.id, { text: "Доступ запрещён" });
    return;
  }

  const data = query.data;
  await bot.answerCallbackQuery(query.id);

  const send = (text, opts = {}) =>
    bot.sendMessage(chatId, text, { parse_mode: "Markdown", ...opts });

  try {
    if (data === "status_server") {
      const status = await runCommand("uptime");
      const mem = await runCommand("free -m");
      const disk = await runCommand("df -h /");
      const msg = [
        "🖥 *Статус сервера*",
        "",
        "*Uptime:*",
        "`" + codeBlock(status.out) + "`",
        "",
        "*Память:*",
        "`" + codeBlock(mem.out) + "`",
        "",
        "*Диск (/):*",
        "`" + codeBlock(disk.out) + "`",
      ].join("\n");
      await send(msg);
      return;
    }

    if (data === "status_app") {
      const { out } = await runCommand("pm2 list");
      await send("📦 *Статус приложения (PM2)*\n\n`" + codeBlock(out) + "`");
      return;
    }

    if (data === "restart_app") {
      await send("Перезапуск приложения…");
      const { ok, out } = await runCommand(`pm2 restart ${PM2_APP_NAME}`);
      await send((ok ? "✅ Приложение перезапущено.\n\n" : "❌ Ошибка:\n\n") + "`" + codeBlock(out) + "`");
      return;
    }

    if (data === "update_app") {
      await send("⬆️ Обновление: git fetch, git pull, npm run " + BUILD_SCRIPT + ", pm2 restart…");
      const steps = [
        `cd "${APP_DIR}" && git fetch`,
        `cd "${APP_DIR}" && git pull`,
        `cd "${APP_DIR}" && npm run ${BUILD_SCRIPT}`,
        `pm2 restart ${PM2_APP_NAME}`,
      ];
      const results = [];
      for (const cmd of steps) {
        const r = await runCommand(cmd, { timeout: 120000 });
        results.push((r.ok ? "✅" : "❌") + " `" + cmd.replace(/^cd "[^"]+" && /, "") + "`\n" + codeBlock(r.out));
        if (!r.ok) break;
      }
      await send("📋 *Результат обновления*\n\n" + results.join("\n\n"));
      return;
    }

    if (data === "restart_server") {
      await send(
        "⚠️ Перезапуск сервера выполнит *reboot*.\nПодтвердите: нажмите кнопку ещё раз в течение 30 сек.",
        {
          reply_markup: {
            inline_keyboard: [[{ text: "✅ Да, перезагрузить сервер", callback_data: "confirm_reboot" }]],
          },
        }
      );
      return;
    }

    if (data === "confirm_reboot") {
      await send("🔴 Выполняю перезагрузку сервера…");
      await runCommand("sudo reboot", { timeout: 5000 }).catch(() => ({}));
      return;
    }

    await send("Неизвестная команда.");
  } catch (err) {
    await send("❌ Ошибка: `" + escapeMarkdown(String(err.message)) + "`");
  }
});

bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});

console.log("Telegram Admin Bot started. Admin chat ID:", ADMIN_CHAT_ID);
