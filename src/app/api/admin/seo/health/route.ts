import { NextRequest, NextResponse } from "next/server";
import { ensurePanelPassword, isAuthorized } from "@/utils/adminAuth";
import { buildSeoHealth, readSeoSettings } from "@/utils/seoSettings";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const passwordError = ensurePanelPassword();
  if (passwordError) return passwordError;
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await readSeoSettings();
    const health = buildSeoHealth(settings);
    return NextResponse.json({ health });
  } catch (error) {
    console.error("SEO health GET error:", error);
    return NextResponse.json({ error: "Не удалось выполнить SEO проверку" }, { status: 500 });
  }
}
