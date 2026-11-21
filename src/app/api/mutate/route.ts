// POST /api/mutate — editor-gated service-role writes. Only performs a write
// when the editor cookie is present AND Supabase service-role is configured.
// Body: { op: "upsert", entity, record } | { op: "remove", entity, id }.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE, EDITOR_COOKIE_VALUE } from "@/lib/auth/editor";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { TABLE_NAMES } from "@/lib/data/entities";
import type { EntityName } from "@/lib/data/entities";
import { recordToRow, rowToRecord } from "@/lib/data/mapping";

const VALID_ENTITIES = new Set<string>(Object.keys(TABLE_NAMES));

type MutateBody =
  | { op: "upsert"; entity: string; record: Record<string, unknown> }
  | { op: "remove"; entity: string; id: string };

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const canEdit =
    cookieStore.get(EDITOR_COOKIE)?.value === EDITOR_COOKIE_VALUE;
  if (!canEdit) {
    return NextResponse.json({ error: "Editor mode required." }, { status: 403 });
  }

  const client = createServiceRoleClient();
  if (!client) {
    return NextResponse.json(
      { error: "Writes are unavailable: Supabase is not configured." },
      { status: 503 },
    );
  }

  let body: MutateBody;
  try {
    body = (await request.json()) as MutateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || !VALID_ENTITIES.has(body.entity)) {
    return NextResponse.json({ error: "Unknown entity." }, { status: 400 });
  }
  const table = TABLE_NAMES[body.entity as EntityName];

  if (body.op === "upsert") {
    const { data, error } = await client
      .from(table)
      .upsert(recordToRow(body.record))
      .select("*")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ record: rowToRecord(data) });
  }

  if (body.op === "remove") {
    const { error } = await client.from(table).delete().eq("id", body.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown operation." }, { status: 400 });
}
