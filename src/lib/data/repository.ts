// Repository layer: the single entry point for every entity read/list/upsert/
// remove/subscribe. When Supabase is configured (browser env vars present),
// reads and realtime subscriptions use the anon browser client; writes are
// POSTed to the editor-gated /api/mutate route handler, which performs the
// actual service-role write server-side. Otherwise everything resolves to the
// in-memory mock store.
"use client";

import { createClient, supabaseAvailable } from "@/lib/supabase/client";
import type { EntityMap, EntityName } from "@/lib/data/entities";
import { TABLE_NAMES } from "@/lib/data/entities";
import { mockStore } from "@/lib/data/mock-store";
import type { Row } from "@/lib/data/mapping";
import { rowToRecord } from "@/lib/data/mapping";

// --- reads -------------------------------------------------------------------
export async function get<K extends EntityName>(
  entity: K,
  id: string,
): Promise<EntityMap[K] | null> {
  if (!supabaseAvailable) return mockStore.get(entity, id);
  const client = createClient();
  if (!client) return mockStore.get(entity, id);
  const { data, error } = await client
    .from(TABLE_NAMES[entity])
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToRecord<EntityMap[K]>(data as Row) : null;
}

export async function list<K extends EntityName>(
  entity: K,
): Promise<EntityMap[K][]> {
  if (!supabaseAvailable) return mockStore.list(entity);
  const client = createClient();
  if (!client) return mockStore.list(entity);
  const { data, error } = await client.from(TABLE_NAMES[entity]).select("*");
  if (error) throw error;
  return ((data ?? []) as Row[]).map((r) => rowToRecord<EntityMap[K]>(r));
}

// --- writes (editor-gated via server route handler) --------------------------
export async function upsert<K extends EntityName>(
  entity: K,
  record: EntityMap[K],
): Promise<EntityMap[K]> {
  if (!supabaseAvailable) return mockStore.upsert(entity, record);
  const res = await fetch("/api/mutate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ op: "upsert", entity, record }),
  });
  if (!res.ok) throw new Error(await errorText(res));
  const json = (await res.json()) as { record: EntityMap[K] };
  return json.record;
}

export async function remove<K extends EntityName>(
  entity: K,
  id: string,
): Promise<void> {
  if (!supabaseAvailable) {
    mockStore.remove(entity, id);
    return;
  }
  const res = await fetch("/api/mutate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ op: "remove", entity, id }),
  });
  if (!res.ok) throw new Error(await errorText(res));
}

async function errorText(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as { error?: string };
    return json.error ?? `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

// --- realtime subscriptions --------------------------------------------------
/**
 * Subscribe to changes for an entity. The callback fires on any change; callers
 * typically re-run `list`. Returns an unsubscribe function. In mock mode this
 * wires into the mock store's pub/sub.
 */
export function subscribe(entity: EntityName, onChange: () => void): () => void {
  if (!supabaseAvailable) return mockStore.subscribe(entity, onChange);
  const client = createClient();
  if (!client) return mockStore.subscribe(entity, onChange);
  const channel = client
    .channel(`realtime:${TABLE_NAMES[entity]}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE_NAMES[entity] },
      () => onChange(),
    )
    .subscribe();
  return () => {
    client.removeChannel(channel);
  };
}
