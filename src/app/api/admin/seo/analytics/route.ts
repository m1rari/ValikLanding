import { NextRequest, NextResponse } from "next/server";
import { ensurePanelPassword, isAuthorized } from "@/utils/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const passwordError = ensurePanelPassword();
  if (passwordError) return passwordError;
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gscProperty = process.env.GSC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const connected = Boolean(process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY && gscProperty);

  return NextResponse.json({
    connected,
    provider: "Google Search Console",
    property: gscProperty,
    note: connected
      ? "Интеграция обнаружена. Следующим шагом можно подключить реальный запрос метрик из GSC API."
      : "Интеграция не настроена. Добавьте GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY, GSC_SITE_URL.",
    metrics: {
      clicks: null,
      impressions: null,
      ctr: null,
      position: null,
    },
  });
}
