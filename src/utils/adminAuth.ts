import { NextRequest, NextResponse } from "next/server";

export function ensurePanelPassword(): NextResponse | null {
  if (!process.env.ADMIN_PANEL_PASSWORD) {
    return NextResponse.json(
      {
        error:
          "Переменная ADMIN_PANEL_PASSWORD не задана. Добавьте ее в .env.local перед использованием панели.",
      },
      { status: 503 }
    );
  }
  return null;
}

export function isAuthorized(req: NextRequest): boolean {
  const expectedPassword = process.env.ADMIN_PANEL_PASSWORD;
  const providedPassword = req.headers.get("x-admin-password");
  return Boolean(expectedPassword && providedPassword && providedPassword === expectedPassword);
}
