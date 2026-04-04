/**
 * Telegram Admin Bot — управление сервером и приложением из Telegram.
 * Отвечает только на сообщения из чата с ADMIN_CHAT_ID.
 *
 * Кнопки: Статус сервера, Статус приложения, Перезапуск приложения, Обновить приложение, Перезапуск сервера.
 */

const path = require("path");
const dotenv = require("dotenv");
// Сначала из корня проекта (там может быть .env.local с TELEGRAM_*)
dotenv.config({ path: path.join(__dirname, "../.env.local") });
// Затем своя папка — переопределение и переменные бота (APP_DIR, PM2_APP_NAME и т.д.)
dotenv.config({ path: path.join(__dirname, ".env") });

const TelegramBot = require("node-telegram-bot-api");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const APP_DIR = process.env.APP_DIR || "/var/www/ValikLanding";
const PM2_APP_NAME = process.env.PM2_APP_NAME || "all";
const BUILD_SCRIPT = process.env.BUILD_SCRIPT || "build";
const USE_DOCKER_DEPLOY =
  process.env.USE_DOCKER_DEPLOY === "1" || process.env.USE_DOCKER_DEPLOY === "true";
const WEB_SERVICE_NAME = process.env.WEB_SERVICE_NAME || "web";
/** Compose-файлы относительно APP_DIR (корень репозитория). Для HTTPS добавьте второй -f в .env. */
const DOCKER_COMPOSE_ARGS =
  process.env.DOCKER_COMPOSE_ARGS || "-f docker/docker-compose.yml";

function dockerComposeCmd() {
  return `docker compose ${DOCKER_COMPOSE_ARGS}`;
}

if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
  console.error("Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local (корень проекта) или в telegram-admin-bot/.env");
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

// ——— Inline-кнопки (привязаны к сообщению) ———
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

// ——— Постоянная кнопка внизу чата (Reply Keyboard) ———
const MENU_BUTTON = "⚙️ Управление сервером";

function getReplyKeyboard() {
  return {
    reply_markup: {
      keyboard: [[MENU_BUTTON]],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };
}

function sendMenu(chatId) {
  return bot.sendMessage(
    chatId,
    "⚙️ *Управление сервером*\n\nВыберите действие:",
    { parse_mode: "Markdown", ...getMainKeyboard() }
  );
}

// ——— Обработка только от админа ———
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (!isAdmin(chatId)) return;

  const text = (msg.text || "").trim();
  const textLower = text.toLowerCase();

  if (text === "/start") {
    bot.sendMessage(
      chatId,
      "Добро пожаловать. Нажмите кнопку внизу, чтобы открыть меню управления.",
      getReplyKeyboard()
    );
    return sendMenu(chatId);
  }

  if (text === "/menu" || textLower === "меню" || text === MENU_BUTTON) {
    return sendMenu(chatId);
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
      if (USE_DOCKER_DEPLOY) {
        const ps = await runCommand(`${dockerComposeCmd()} ps`, { cwd: APP_DIR, timeout: 30000 });
        const dfdocker = await runCommand(`${dockerComposeCmd()} exec -T ${WEB_SERVICE_NAME} df -h / 2>/dev/null || df -h /`, {
          cwd: APP_DIR,
          timeout: 30000,
        });
        const msg = [
          "🐳 *Статус (Docker Compose)*",
          "",
          "*Контейнеры:*",
          "`" + codeBlock(ps.out) + "`",
          "",
          "*Диск (в контейнере web или среде бота):*",
          "`" + codeBlock(dfdocker.out) + "`",
          "",
          "_Полный uptime/память хоста смотрите по SSH; здесь только проект._",
        ].join("\n");
        await send(msg);
        return;
      }

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
      if (USE_DOCKER_DEPLOY) {
        const { out } = await runCommand(`${dockerComposeCmd()} ps ${WEB_SERVICE_NAME}`, {
          cwd: APP_DIR,
          timeout: 30000,
        });
        await send("📦 *Статус приложения (Docker)*\n\n`" + codeBlock(out) + "`");
        return;
      }

      const { out } = await runCommand("pm2 list");
      await send("📦 *Статус приложения (PM2)*\n\n`" + codeBlock(out) + "`");
      return;
    }

    if (data === "restart_app") {
      if (USE_DOCKER_DEPLOY) {
        await send("Перезапуск контейнеров web и nginx…");
        const { ok, out } = await runCommand(`${dockerComposeCmd()} restart ${WEB_SERVICE_NAME} nginx`, {
          cwd: APP_DIR,
          timeout: 120000,
        });
        await send((ok ? "✅ Контейнеры перезапущены.\n\n" : "❌ Ошибка:\n\n") + "`" + codeBlock(out) + "`");
        return;
      }

      await send("Перезапуск приложения…");
      const { ok, out } = await runCommand(`pm2 restart ${PM2_APP_NAME}`);
      await send((ok ? "✅ Приложение перезапущено.\n\n" : "❌ Ошибка:\n\n") + "`" + codeBlock(out) + "`");
      return;
    }

    if (data === "update_app") {
      if (USE_DOCKER_DEPLOY) {
        await send("⬆️ Обновление: git pull, docker compose build web, up -d web nginx…");
        const steps = [
          `git fetch`,
          `git pull`,
          `${dockerComposeCmd()} build web`,
          `${dockerComposeCmd()} up -d web nginx`,
        ];
        const results = [];
        let hadError = false;

        for (const part of steps) {
          const r = await runCommand(part, { timeout: 600000, cwd: APP_DIR });
          const label = part;
          results.push((r.ok ? "✅" : "❌") + " `" + label + "`\n" + codeBlock(r.out));
          if (!r.ok) {
            hadError = true;
            break;
          }
        }

        if (!hadError) {
          const lastCommit = await runCommand(`git log -1 --oneline`, {
            timeout: 15000,
            cwd: APP_DIR,
          });

          let text = "✅ Образ web пересобран, контейнеры web и nginx обновлены.";

          if (lastCommit.ok && lastCommit.out) {
            const firstLine = String(lastCommit.out).split("\n")[0];
            const shortLine = firstLine.length > 300 ? firstLine.slice(0, 300) + "…" : firstLine;
            text += "\n\nПоследний коммит:\n" + shortLine;
          }

          text += "\n\n_Если поднят профиль admin, перезапустите admin-bot вручную при необходимости._";
          await bot.sendMessage(chatId, text);
        } else {
          await send("❌ Обновление завершилось с ошибкой.");
          const fullLog = results.join("\n\n");
          const trimmedLog = fullLog.length > 3400 ? fullLog.slice(0, 3400) + "… (обрезано)" : fullLog;
          await send("📋 *Лог команд:*\n\n`" + codeBlock(trimmedLog) + "`");
        }
        return;
      }

      await send("⬆️ Обновление: git fetch, git pull, npm run " + BUILD_SCRIPT + ", pm2 restart…");
      const steps = [
        `cd "${APP_DIR}" && git fetch`,
        `cd "${APP_DIR}" && git pull`,
        `cd "${APP_DIR}" && npm run ${BUILD_SCRIPT}`,
        `pm2 restart ${PM2_APP_NAME}`,
      ];
      const results = [];
      let hadError = false;

      for (const cmd of steps) {
        const r = await runCommand(cmd, { timeout: 120000 });
        results.push(
          (r.ok ? "✅" : "❌") +
            " `" +
            cmd.replace(/^cd "[^"]+" && /, "") +
            "`\n" +
            codeBlock(r.out)
        );
        if (!r.ok) {
          hadError = true;
          break;
        }
      }

      if (!hadError) {
        const lastCommit = await runCommand(`cd "${APP_DIR}" && git log -1 --oneline`, {
          timeout: 15000,
        });

        let text = "✅ Обновление приложения завершено успешно.";

        if (lastCommit.ok && lastCommit.out) {
          const firstLine = String(lastCommit.out).split("\n")[0];
          const shortLine = firstLine.length > 300 ? firstLine.slice(0, 300) + "…" : firstLine;
          text += "\n\nПоследний коммит:\n" + shortLine;
        }

        await bot.sendMessage(chatId, text);
      } else {
        await send("❌ Обновление завершилось с ошибкой.");
        const fullLog = results.join("\n\n");
        const trimmedLog = fullLog.length > 3400 ? fullLog.slice(0, 3400) + "… (обрезано)" : fullLog;
        await send("📋 *Лог команд:*\n\n`" + codeBlock(trimmedLog) + "`");
      }
      return;
    }

    if (data === "restart_server") {
      if (USE_DOCKER_DEPLOY) {
        await bot.sendMessage(
          chatId,
          "В режиме Docker перезагрузку всего сервера из бота отключили. Используйте панель хостинга или SSH (sudo reboot)."
        );
        return;
      }

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
      if (USE_DOCKER_DEPLOY) {
        await bot.sendMessage(
          chatId,
          "Перезагрузка сервера из Docker-режима недоступна. Выполните `sudo reboot` по SSH."
        );
        return;
      }

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
