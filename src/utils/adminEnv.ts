import fs from "fs/promises";
import path from "path";

const ENV_LOCAL_PATH = path.join(process.cwd(), ".env.local");

export interface AdminEnvConfig {
  telegramBotToken: string;
  telegramChatIds: string[];
  telegramAdminChatIds: string[];
  googleSheetPricesUrl: string;
  appDir: string;
  pm2AppName: string;
  buildScript: string;
}

interface EnvMap {
  [key: string]: string;
}

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseEnv(content: string): EnvMap {
  const entries: EnvMap = {};
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    entries[match[1]] = stripWrappingQuotes(match[2]);
  }

  return entries;
}

function parseChatIds(raw: string): string[] {
  return raw
    .split(/[,\n;\s]+/)
    .map((id) => id.trim())
    .filter(Boolean)
    .filter((id, index, arr) => arr.indexOf(id) === index);
}

function serializeValue(value: string): string {
  if (value === "") return "\"\"";
  if (/[\s#"'`]/.test(value)) {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
  }
  return value;
}

function getIdsFromMap(map: EnvMap, pluralKey: string, singleKey: string): string[] {
  const plural = parseChatIds(map[pluralKey] || "");
  if (plural.length > 0) return plural;
  return parseChatIds(map[singleKey] || "");
}

function normalizeConfig(input: AdminEnvConfig): AdminEnvConfig {
  return {
    telegramBotToken: input.telegramBotToken.trim(),
    telegramChatIds: parseChatIds(input.telegramChatIds.join(",")),
    telegramAdminChatIds: parseChatIds(input.telegramAdminChatIds.join(",")),
    googleSheetPricesUrl: input.googleSheetPricesUrl.trim(),
    appDir: input.appDir.trim(),
    pm2AppName: input.pm2AppName.trim(),
    buildScript: input.buildScript.trim(),
  };
}

function buildConfigFromMap(map: EnvMap): AdminEnvConfig {
  return {
    telegramBotToken: map.TELEGRAM_BOT_TOKEN || "",
    telegramChatIds: getIdsFromMap(map, "TELEGRAM_CHAT_IDS", "TELEGRAM_CHAT_ID"),
    telegramAdminChatIds: getIdsFromMap(map, "TELEGRAM_ADMIN_CHAT_IDS", "TELEGRAM_ADMIN_CHAT_ID"),
    googleSheetPricesUrl: map.GOOGLE_SHEET_PRICES_URL || "",
    appDir: map.APP_DIR || "/var/www/electromaster",
    pm2AppName: map.PM2_APP_NAME || "all",
    buildScript: map.BUILD_SCRIPT || "build",
  };
}

function validateIds(ids: string[], fieldName: string): void {
  for (const id of ids) {
    if (!/^-?\d+$/.test(id)) {
      throw new Error(`Поле ${fieldName} содержит некорректный chat id: ${id}`);
    }
  }
}

export async function readAdminEnvConfig(): Promise<{ config: AdminEnvConfig; rawMap: EnvMap }> {
  let content = "";
  try {
    content = await fs.readFile(ENV_LOCAL_PATH, "utf8");
  } catch (error: unknown) {
    if ((error as { code?: string }).code !== "ENOENT") {
      throw error;
    }
  }

  const rawMap = parseEnv(content);
  return { config: buildConfigFromMap(rawMap), rawMap };
}

export async function writeAdminEnvConfig(input: AdminEnvConfig): Promise<AdminEnvConfig> {
  const normalized = normalizeConfig(input);
  validateIds(normalized.telegramChatIds, "TELEGRAM_CHAT_IDS");
  validateIds(normalized.telegramAdminChatIds, "TELEGRAM_ADMIN_CHAT_IDS");

  const { rawMap } = await readAdminEnvConfig();
  const nextMap: EnvMap = { ...rawMap };

  nextMap.TELEGRAM_BOT_TOKEN = normalized.telegramBotToken;
  nextMap.TELEGRAM_CHAT_IDS = normalized.telegramChatIds.join(",");
  nextMap.TELEGRAM_CHAT_ID = normalized.telegramChatIds[0] || "";
  nextMap.TELEGRAM_ADMIN_CHAT_IDS = normalized.telegramAdminChatIds.join(",");
  nextMap.TELEGRAM_ADMIN_CHAT_ID = normalized.telegramAdminChatIds[0] || "";
  nextMap.GOOGLE_SHEET_PRICES_URL = normalized.googleSheetPricesUrl;
  nextMap.APP_DIR = normalized.appDir;
  nextMap.PM2_APP_NAME = normalized.pm2AppName;
  nextMap.BUILD_SCRIPT = normalized.buildScript;

  const lines = Object.entries(nextMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${serializeValue(value)}`);

  await fs.writeFile(ENV_LOCAL_PATH, `${lines.join("\n")}\n`, "utf8");

  process.env.TELEGRAM_BOT_TOKEN = nextMap.TELEGRAM_BOT_TOKEN;
  process.env.TELEGRAM_CHAT_IDS = nextMap.TELEGRAM_CHAT_IDS;
  process.env.TELEGRAM_CHAT_ID = nextMap.TELEGRAM_CHAT_ID;
  process.env.TELEGRAM_ADMIN_CHAT_IDS = nextMap.TELEGRAM_ADMIN_CHAT_IDS;
  process.env.TELEGRAM_ADMIN_CHAT_ID = nextMap.TELEGRAM_ADMIN_CHAT_ID;
  process.env.GOOGLE_SHEET_PRICES_URL = nextMap.GOOGLE_SHEET_PRICES_URL;
  process.env.APP_DIR = nextMap.APP_DIR;
  process.env.PM2_APP_NAME = nextMap.PM2_APP_NAME;
  process.env.BUILD_SCRIPT = nextMap.BUILD_SCRIPT;

  return buildConfigFromMap(nextMap);
}
