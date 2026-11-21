// POST /api/editor/lock — clear the editor cookie.
import { NextResponse } from "next/server";
import { EDITOR_COOKIE } from "@/lib/auth/editor";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(EDITOR_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
