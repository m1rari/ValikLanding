import fs from "fs/promises";
import path from "path";

const SEO_SETTINGS_PATH = path.join(process.cwd(), ".seo-settings.json");
const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pinsk-elektrik.by";

export interface SeoSettings {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  canonicalPath: string;
  keywords: string[];
  indexingEnabled: boolean;
  siteName: string;
}

const DEFAULT_SETTINGS: SeoSettings = {
  title: "Электрик в Пинске - установка и ремонт электропроводки",
  description:
    "Электрик в Пинске и Пинском районе: установка и ремонт электропроводки, щитов, розеток и освещения. Договор, акт, выезд мастера.",
  ogTitle: "Электрик в Пинске - установка и ремонт электропроводки",
  ogDescription:
    "Электрик в Пинске и Пинском районе: установка и ремонт электропроводки, щитов, розеток и освещения. Договор, акт, выезд мастера.",
  canonicalPath: "/",
  keywords: [
    "электромонтаж Пинск",
    "электрик Пинск",
    "замена проводки Пинск",
    "монтаж щита Пинск",
    "электромонтажные работы Пинский район",
    "ИП Шугайло",
    "вызов электрика Пинск",
    "монтаж освещения Пинск",
    "установка розеток Пинск",
    "электрик на дом Пинск",
    "электромонтаж квартира Пинск",
    "электромонтаж частный дом Пинск",
  ],
  indexingEnabled: true,
  siteName: "ИП Шугайло — Электрик в Пинске",
};

function uniqueKeywords(input: string[]): string[] {
  return input.map((item) => item.trim()).filter(Boolean).filter((item, idx, arr) => arr.indexOf(item) === idx);
}

function normalizePath(rawPath: string): string {
  const trimmed = rawPath.trim();
  if (!trimmed) return "/";
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}

function parseSettings(raw: unknown): SeoSettings {
  const source = (raw && typeof raw === "object" ? raw : {}) as Partial<SeoSettings>;
  return {
    title: (source.title || DEFAULT_SETTINGS.title).trim(),
    description: (source.description || DEFAULT_SETTINGS.description).trim(),
    ogTitle: (source.ogTitle || source.title || DEFAULT_SETTINGS.ogTitle).trim(),
    ogDescription: (source.ogDescription || source.description || DEFAULT_SETTINGS.ogDescription).trim(),
    canonicalPath: normalizePath(source.canonicalPath || DEFAULT_SETTINGS.canonicalPath),
    keywords: uniqueKeywords(Array.isArray(source.keywords) ? source.keywords : DEFAULT_SETTINGS.keywords),
    indexingEnabled: source.indexingEnabled !== false,
    siteName: (source.siteName || DEFAULT_SETTINGS.siteName).trim(),
  };
}

export interface SeoHealthResult {
  checks: Array<{ key: string; ok: boolean; message: string }>;
  score: number;
}

export async function readSeoSettings(): Promise<SeoSettings> {
  try {
    const raw = await fs.readFile(SEO_SETTINGS_PATH, "utf8");
    return parseSettings(JSON.parse(raw));
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "ENOENT") {
      return DEFAULT_SETTINGS;
    }
    console.error("Failed to read seo settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function writeSeoSettings(nextSettings: SeoSettings): Promise<SeoSettings> {
  const normalized = parseSettings(nextSettings);
  await fs.writeFile(SEO_SETTINGS_PATH, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

export function buildSeoHealth(settings: SeoSettings): SeoHealthResult {
  const canonicalAbsolute = new URL(settings.canonicalPath, DEFAULT_SITE_URL).toString();
  const robotsUrl = `${DEFAULT_SITE_URL}/robots.txt`;
  const sitemapUrl = `${DEFAULT_SITE_URL}/sitemap.xml`;

  const checks = [
    {
      key: "title",
      ok: settings.title.length >= 20 && settings.title.length <= 70,
      message: `Title: ${settings.title.length} символов (рекомендация 20-70)`,
    },
    {
      key: "description",
      ok: settings.description.length >= 120 && settings.description.length <= 170,
      message: `Description: ${settings.description.length} символов (рекомендация 120-170)`,
    },
    {
      key: "canonical",
      ok: canonicalAbsolute.startsWith("http"),
      message: `Canonical: ${canonicalAbsolute}`,
    },
    {
      key: "indexing",
      ok: settings.indexingEnabled,
      message: settings.indexingEnabled ? "Индексация включена" : "Индексация отключена (noindex)",
    },
    {
      key: "keywords",
      ok: settings.keywords.length >= 5,
      message: `Keywords: ${settings.keywords.length} шт.`,
    },
    {
      key: "sitemap",
      ok: true,
      message: `Sitemap URL: ${sitemapUrl}`,
    },
    {
      key: "robots",
      ok: true,
      message: `Robots URL: ${robotsUrl}`,
    },
  ];

  const score = Math.round((checks.filter((check) => check.ok).length / checks.length) * 100);
  return { checks, score };
}
