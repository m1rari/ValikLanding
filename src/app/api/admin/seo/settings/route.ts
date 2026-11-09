import { NextRequest, NextResponse } from "next/server";
import { ensurePanelPassword, isAuthorized } from "@/utils/adminAuth";
import { readSeoSettings, writeSeoSettings } from "@/utils/seoSettings";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const passwordError = ensurePanelPassword();
  if (passwordError) return passwordError;
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await readSeoSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("SEO settings GET error:", error);
    return NextResponse.json({ error: "Не удалось прочитать SEO настройки" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const passwordError = ensurePanelPassword();
  if (passwordError) return passwordError;
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
      canonicalPath: string;
      keywords: string[];
      indexingEnabled: boolean;
      siteName: string;
    };

    const settings = await writeSeoSettings({
      title: body.title || "",
      description: body.description || "",
      ogTitle: body.ogTitle || "",
      ogDescription: body.ogDescription || "",
      canonicalPath: body.canonicalPath || "/",
      keywords: Array.isArray(body.keywords) ? body.keywords : [],
      indexingEnabled: body.indexingEnabled !== false,
      siteName: body.siteName || "",
    });

    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error("SEO settings POST error:", error);
    const message = error instanceof Error ? error.message : "Не удалось сохранить SEO настройки";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
