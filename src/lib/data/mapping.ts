// camelCase <-> snake_case mapping between app records and Supabase rows.
// Isolated from the client repository so server route handlers can reuse it.
export type Row = Record<string, unknown>;

function toSnake(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

function toCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function rowToRecord<T>(row: Row): T {
  const out: Row = {};
  for (const [k, v] of Object.entries(row)) out[toCamel(k)] = v;
  return out as T;
}

export function recordToRow<T extends object>(record: T): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(record)) out[toSnake(k)] = v;
  return out;
}
