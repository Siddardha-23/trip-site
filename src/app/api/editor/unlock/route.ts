// POST /api/editor/unlock — compare body.password to EDITOR_PASSWORD with a
// constant-time compare; on match set an httpOnly editor cookie.
import { NextResponse } from "next/server";
import {
  EDITOR_COOKIE,
  EDITOR_COOKIE_VALUE,
  checkEditorPassword,
} from "@/lib/auth/editor";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    // ignore malformed body; treated as empty password
  }

  if (!checkEditorPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(EDITOR_COOKIE, EDITOR_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
