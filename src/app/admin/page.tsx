"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

interface AdminEnvConfig {
  telegramBotToken: string;
  telegramChatIds: string[];
  telegramAdminChatIds: string[];
  appDir: string;
  pm2AppName: string;
  buildScript: string;
}

const EMPTY_CONFIG: AdminEnvConfig = {
  telegramBotToken: "",
  telegramChatIds: [],
  telegramAdminChatIds: [],
  appDir: "/var/www/ValikLanding",
  pm2AppName: "all",
  buildScript: "build",
};

function listToTextarea(value: string[]): string {
  return value.join("\n");
}

function textareaToList(value: string): string[] {
  return value
    .split(/[\n,;\s]+/)
    .map((id) => id.trim())
    .filter(Boolean)
    .filter((id, index, arr) => arr.indexOf(id) === index);
}

export default function AdminEnvPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [config, setConfig] = useState<AdminEnvConfig>(EMPTY_CONFIG);
  const [chatIdsText, setChatIdsText] = useState("");
  const [adminChatIdsText, setAdminChatIdsText] = useState("");

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-password": password,
    }),
    [password]
  );

  useEffect(() => {
    const savedPassword = window.localStorage.getItem("admin-panel-password") || "";
    if (!savedPassword) return;
    setPassword(savedPassword);
  }, []);

  async function loadConfig(currentPassword: string): Promise<void> {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/env", {
        method: "GET",
        headers: {
          "x-admin-password": currentPassword,
        },
      });

      const payload = (await response.json()) as { error?: string; config?: AdminEnvConfig };
      if (!response.ok || !payload.config) {
        throw new Error(payload.error || "Не удалось авторизоваться");
      }

      setConfig(payload.config);
      setChatIdsText(listToTextarea(payload.config.telegramChatIds));
      setAdminChatIdsText(listToTextarea(payload.config.telegramAdminChatIds));
      setIsAuthorized(true);
      window.localStorage.setItem("admin-panel-password", currentPassword);
    } catch (loadError) {
      setIsAuthorized(false);
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить настройки");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!password.trim()) {
      setError("Введите пароль панели");
      return;
    }
    await loadConfig(password.trim());
  }

  async function handleSave(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const payload: AdminEnvConfig = {
        telegramBotToken: config.telegramBotToken.trim(),
        telegramChatIds: textareaToList(chatIdsText),
        telegramAdminChatIds: textareaToList(adminChatIdsText),
        appDir: config.appDir.trim(),
        pm2AppName: config.pm2AppName.trim(),
        buildScript: config.buildScript.trim(),
      };

      const response = await fetch("/api/admin/env", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as { error?: string; config?: AdminEnvConfig };
      if (!response.ok || !body.config) {
        throw new Error(body.error || "Ошибка сохранения");
      }

      setConfig(body.config);
      setChatIdsText(listToTextarea(body.config.telegramChatIds));
      setAdminChatIdsText(listToTextarea(body.config.telegramAdminChatIds));
      setSuccess("Настройки сохранены в .env.local");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка сохранения");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-slate-100">
      <h1 className="text-2xl font-bold">Admin panel: Telegram env</h1>
      <p className="mt-2 text-sm text-slate-300">
        Здесь можно управлять chat id и серверными настройками без ручного редактирования файлов.
      </p>

      {!isAuthorized ? (
        <form onSubmit={handleAuth} className="mt-8 space-y-4 rounded-xl border border-slate-700 p-5">
          <label className="block text-sm text-slate-300" htmlFor="panel-password">
            Пароль панели (ADMIN_PANEL_PASSWORD)
          </label>
          <input
            id="panel-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
            placeholder="Введите пароль"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-sky-600 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {isLoading ? "Проверка..." : "Войти"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSave} className="mt-8 space-y-4 rounded-xl border border-slate-700 p-5">
          <div>
            <label className="block text-sm text-slate-300" htmlFor="telegram-bot-token">
              TELEGRAM_BOT_TOKEN
            </label>
            <input
              id="telegram-bot-token"
              type="text"
              value={config.telegramBotToken}
              onChange={(event) => setConfig((prev) => ({ ...prev, telegramBotToken: event.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300" htmlFor="telegram-chat-ids">
              TELEGRAM_CHAT_IDS (несколько ID)
            </label>
            <textarea
              id="telegram-chat-ids"
              value={chatIdsText}
              onChange={(event) => setChatIdsText(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
              placeholder="-1001234567890&#10;123456789"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300" htmlFor="telegram-admin-chat-ids">
              TELEGRAM_ADMIN_CHAT_IDS (несколько ID)
            </label>
            <textarea
              id="telegram-admin-chat-ids"
              value={adminChatIdsText}
              onChange={(event) => setAdminChatIdsText(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
              placeholder="123456789&#10;987654321"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300" htmlFor="app-dir">
              APP_DIR
            </label>
            <input
              id="app-dir"
              type="text"
              value={config.appDir}
              onChange={(event) => setConfig((prev) => ({ ...prev, appDir: event.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-slate-300" htmlFor="pm2-app-name">
                PM2_APP_NAME
              </label>
              <input
                id="pm2-app-name"
                type="text"
                value={config.pm2AppName}
                onChange={(event) => setConfig((prev) => ({ ...prev, pm2AppName: event.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300" htmlFor="build-script">
                BUILD_SCRIPT
              </label>
              <input
                id="build-script"
                type="text"
                value={config.buildScript}
                onChange={(event) => setConfig((prev) => ({ ...prev, buildScript: event.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {isSaving ? "Сохраняю..." : "Сохранить"}
          </button>
        </form>
      )}

      {error && <p className="mt-4 rounded-md border border-red-500/60 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</p>}
      {success && (
        <p className="mt-4 rounded-md border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          {success}. Для `telegram-admin-bot` после изменения env перезапустите процесс в PM2.
        </p>
      )}
    </main>
  );
}
