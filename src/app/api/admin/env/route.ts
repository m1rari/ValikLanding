import { NextRequest, NextResponse } from "next/server";
import { readAdminEnvConfig, writeAdminEnvConfig } from "@/utils/adminEnv";
import { ensurePanelPassword, isAuthorized } from "@/utils/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const passwordError = ensurePanelPassword();
  if (passwordError) return passwordError;

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { config } = await readAdminEnvConfig();
    return NextResponse.json({ config });
  } catch (error) {
    console.error("Admin env GET error:", error);
    return NextResponse.json({ error: "Не удалось прочитать конфигурацию" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const passwordError = ensurePanelPassword();
  if (passwordError) return passwordError;

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      telegramBotToken: string;
      telegramChatIds: string[];
      telegramAdminChatIds: string[];
      googleSheetPricesUrl: string;
      appDir: string;
      pm2AppName: string;
      buildScript: string;
    };

    const config = await writeAdminEnvConfig({
      telegramBotToken: body.telegramBotToken || "",
      telegramChatIds: Array.isArray(body.telegramChatIds) ? body.telegramChatIds : [],
      telegramAdminChatIds: Array.isArray(body.telegramAdminChatIds) ? body.telegramAdminChatIds : [],
      googleSheetPricesUrl: body.googleSheetPricesUrl || "",
      appDir: body.appDir || "/var/www/ValikLanding",
      pm2AppName: body.pm2AppName || "all",
      buildScript: body.buildScript || "build",
    });

    return NextResponse.json({ ok: true, config });
  } catch (error) {
    console.error("Admin env POST error:", error);
    const message = error instanceof Error ? error.message : "Не удалось сохранить конфигурацию";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
