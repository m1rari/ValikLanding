"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

interface AdminEnvConfig {
  telegramBotToken: string;
  telegramChatIds: string[];
  telegramAdminChatIds: string[];
  googleSheetPricesUrl: string;
  appDir: string;
  pm2AppName: string;
  buildScript: string;
}

interface SeoSettings {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  canonicalPath: string;
  keywords: string[];
  indexingEnabled: boolean;
  siteName: string;
}

interface SeoHealthCheck {
  key: string;
  ok: boolean;
  message: string;
}

interface SeoHealthResult {
  checks: SeoHealthCheck[];
  score: number;
}

interface SeoAnalyticsResult {
  connected: boolean;
  provider: string;
  property: string;
  note: string;
  metrics: {
    clicks: number | null;
    impressions: number | null;
    ctr: number | null;
    position: number | null;
  };
}

const EMPTY_CONFIG: AdminEnvConfig = {
  telegramBotToken: "",
  telegramChatIds: [],
  telegramAdminChatIds: [],
  googleSheetPricesUrl: "",
  appDir: "/var/www/ValikLanding",
  pm2AppName: "all",
  buildScript: "build",
};

const EMPTY_SEO: SeoSettings = {
  title: "",
  description: "",
  ogTitle: "",
  ogDescription: "",
  canonicalPath: "/",
  keywords: [],
  indexingEnabled: true,
  siteName: "",
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

function textareaToKeywordList(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .filter((keyword, index, arr) => arr.indexOf(keyword) === index);
}

export default function AdminEnvPage() {
  const [tab, setTab] = useState<"env" | "seo">("env");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeoSaving, setIsSeoSaving] = useState(false);
  const [isSeoRefreshing, setIsSeoRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [config, setConfig] = useState<AdminEnvConfig>(EMPTY_CONFIG);
  const [seo, setSeo] = useState<SeoSettings>(EMPTY_SEO);
  const [seoHealth, setSeoHealth] = useState<SeoHealthResult | null>(null);
  const [seoAnalytics, setSeoAnalytics] = useState<SeoAnalyticsResult | null>(null);
  const [chatIdsText, setChatIdsText] = useState("");
  const [adminChatIdsText, setAdminChatIdsText] = useState("");
  const [seoKeywordsText, setSeoKeywordsText] = useState("");

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

  async function fetchSeoDiagnostics(): Promise<void> {
    setIsSeoRefreshing(true);
    try {
      const [healthResponse, analyticsResponse] = await Promise.all([
        fetch("/api/admin/seo/health", { method: "GET", headers: authHeaders }),
        fetch("/api/admin/seo/analytics", { method: "GET", headers: authHeaders }),
      ]);

      if (healthResponse.ok) {
        const healthPayload = (await healthResponse.json()) as { health?: SeoHealthResult };
        if (healthPayload.health) setSeoHealth(healthPayload.health);
      }

      if (analyticsResponse.ok) {
        const analyticsPayload = (await analyticsResponse.json()) as SeoAnalyticsResult;
        setSeoAnalytics(analyticsPayload);
      }
    } finally {
      setIsSeoRefreshing(false);
    }
  }

  async function loadAll(currentPassword: string): Promise<void> {
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
      const seoResponse = await fetch("/api/admin/seo/settings", {
        method: "GET",
        headers: {
          "x-admin-password": currentPassword,
        },
      });

      const payload = (await response.json()) as { error?: string; config?: AdminEnvConfig };
      const seoPayload = (await seoResponse.json()) as { error?: string; settings?: SeoSettings };
      if (!response.ok || !payload.config) {
        throw new Error(payload.error || "Не удалось авторизоваться");
      }
      if (!seoResponse.ok || !seoPayload.settings) {
        throw new Error(seoPayload.error || "Не удалось загрузить SEO настройки");
      }

      setConfig(payload.config);
      setChatIdsText(listToTextarea(payload.config.telegramChatIds));
      setAdminChatIdsText(listToTextarea(payload.config.telegramAdminChatIds));
      setSeo(seoPayload.settings);
      setSeoKeywordsText(listToTextarea(seoPayload.settings.keywords));
      setIsAuthorized(true);
      window.localStorage.setItem("admin-panel-password", currentPassword);
      await fetchSeoDiagnostics();
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
    await loadAll(password.trim());
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
        googleSheetPricesUrl: config.googleSheetPricesUrl.trim(),
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

  async function handleSeoSave(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSeoSaving(true);

    try {
      const payload: SeoSettings = {
        title: seo.title.trim(),
        description: seo.description.trim(),
        ogTitle: seo.ogTitle.trim(),
        ogDescription: seo.ogDescription.trim(),
        canonicalPath: seo.canonicalPath.trim(),
        keywords: textareaToKeywordList(seoKeywordsText),
        indexingEnabled: seo.indexingEnabled,
        siteName: seo.siteName.trim(),
      };

      const response = await fetch("/api/admin/seo/settings", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as { error?: string; settings?: SeoSettings };
      if (!response.ok || !body.settings) {
        throw new Error(body.error || "Ошибка сохранения SEO");
      }

      setSeo(body.settings);
      setSeoKeywordsText(listToTextarea(body.settings.keywords));
      setSuccess("SEO настройки сохранены");
      await fetchSeoDiagnostics();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка сохранения SEO");
    } finally {
      setIsSeoSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-slate-100">
      <h1 className="text-2xl font-bold">Admin panel: ENV + SEO</h1>
      <p className="mt-2 text-sm text-slate-300">
        Здесь можно управлять chat id, серверными параметрами и SEO без ручного редактирования файлов.
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
        <section className="mt-8 space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("env")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                tab === "env" ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              ENV
            </button>
            <button
              type="button"
              onClick={() => setTab("seo")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                tab === "seo" ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              SEO
            </button>
          </div>

          {tab === "env" ? (
            <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-slate-700 p-5">
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

              <div>
                <label className="block text-sm text-slate-300" htmlFor="google-sheet-prices-url">
                  GOOGLE_SHEET_PRICES_URL
                </label>
                <input
                  id="google-sheet-prices-url"
                  type="text"
                  value={config.googleSheetPricesUrl}
                  onChange={(event) =>
                    setConfig((prev) => ({ ...prev, googleSheetPricesUrl: event.target.value }))
                  }
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                  placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
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
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleSeoSave} className="space-y-4 rounded-xl border border-slate-700 p-5">
                <div>
                  <label className="block text-sm text-slate-300" htmlFor="seo-title">
                    SEO Title
                  </label>
                  <input
                    id="seo-title"
                    type="text"
                    value={seo.title}
                    onChange={(event) => setSeo((prev) => ({ ...prev, title: event.target.value }))}
                    className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300" htmlFor="seo-description">
                    SEO Description
                  </label>
                  <textarea
                    id="seo-description"
                    value={seo.description}
                    onChange={(event) => setSeo((prev) => ({ ...prev, description: event.target.value }))}
                    rows={3}
                    className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm text-slate-300" htmlFor="seo-og-title">
                      OG Title
                    </label>
                    <input
                      id="seo-og-title"
                      type="text"
                      value={seo.ogTitle}
                      onChange={(event) => setSeo((prev) => ({ ...prev, ogTitle: event.target.value }))}
                      className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300" htmlFor="seo-site-name">
                      Site Name
                    </label>
                    <input
                      id="seo-site-name"
                      type="text"
                      value={seo.siteName}
                      onChange={(event) => setSeo((prev) => ({ ...prev, siteName: event.target.value }))}
                      className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300" htmlFor="seo-og-description">
                    OG Description
                  </label>
                  <textarea
                    id="seo-og-description"
                    value={seo.ogDescription}
                    onChange={(event) => setSeo((prev) => ({ ...prev, ogDescription: event.target.value }))}
                    rows={2}
                    className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm text-slate-300" htmlFor="seo-canonical">
                      Canonical path
                    </label>
                    <input
                      id="seo-canonical"
                      type="text"
                      value={seo.canonicalPath}
                      onChange={(event) => setSeo((prev) => ({ ...prev, canonicalPath: event.target.value }))}
                      className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                      placeholder="/"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={seo.indexingEnabled}
                      onChange={(event) => setSeo((prev) => ({ ...prev, indexingEnabled: event.target.checked }))}
                    />
                    Разрешить индексацию (index/follow)
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-slate-300" htmlFor="seo-keywords">
                    Keywords (по одному в строке)
                  </label>
                  <textarea
                    id="seo-keywords"
                    value={seoKeywordsText}
                    onChange={(event) => setSeoKeywordsText(event.target.value)}
                    rows={6}
                    className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSeoSaving}
                    className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-60"
                  >
                    {isSeoSaving ? "Сохраняю..." : "Сохранить SEO"}
                  </button>
                  <button
                    type="button"
                    onClick={fetchSeoDiagnostics}
                    disabled={isSeoRefreshing}
                    className="rounded-md bg-slate-700 px-4 py-2 font-medium text-white disabled:opacity-60"
                  >
                    {isSeoRefreshing ? "Проверяю..." : "Обновить health-check"}
                  </button>
                </div>
              </form>

              <div className="rounded-xl border border-slate-700 p-5">
                <h2 className="text-lg font-semibold">SEO Health</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Score: {seoHealth ? `${seoHealth.score}%` : "—"}
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  {seoHealth?.checks.map((check) => (
                    <p key={check.key} className={check.ok ? "text-emerald-300" : "text-amber-300"}>
                      {check.ok ? "✅" : "⚠️"} {check.message}
                    </p>
                  )) || <p className="text-slate-400">Данные еще не загружены</p>}
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 p-5">
                <h2 className="text-lg font-semibold">SEO Analytics</h2>
                {seoAnalytics ? (
                  <div className="mt-2 space-y-1 text-sm text-slate-300">
                    <p>Провайдер: {seoAnalytics.provider}</p>
                    <p>Property: {seoAnalytics.property || "не указано"}</p>
                    <p>Статус: {seoAnalytics.connected ? "подключено" : "не подключено"}</p>
                    <p>{seoAnalytics.note}</p>
                    <p className="pt-1 text-slate-400">
                      Метрики (MVP-заглушка): clicks={String(seoAnalytics.metrics.clicks)}, impressions=
                      {String(seoAnalytics.metrics.impressions)}, ctr={String(seoAnalytics.metrics.ctr)}, position=
                      {String(seoAnalytics.metrics.position)}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">Данные аналитики еще не загружены</p>
                )}
              </div>
            </div>
          )}
        </section>
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
