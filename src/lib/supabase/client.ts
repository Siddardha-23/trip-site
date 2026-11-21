// Browser-side Supabase client (anon key). Used for reads and realtime
// subscriptions when Supabase env vars are present; otherwise the repository
// falls back to the in-memory mock store.
import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when both public Supabase env vars are set (real backend mode). */
export const supabaseAvailable = Boolean(url && anonKey);

/**
 * Create a browser Supabase client. Returns null in mock mode (no env vars),
 * so callers must guard on `supabaseAvailable` before using it.
 */
export function createClient() {
  if (!supabaseAvailable) return null;
  return createBrowserClient(url!, anonKey!);
}
