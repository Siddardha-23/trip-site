// GET /api/editor/status — report whether the editor cookie is set.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE, EDITOR_COOKIE_VALUE } from "@/lib/auth/editor";

export async function GET() {
  const cookieStore = await cookies();
  const canEdit = cookieStore.get(EDITOR_COOKIE)?.value === EDITOR_COOKIE_VALUE;
  return NextResponse.json({ canEdit });
}
