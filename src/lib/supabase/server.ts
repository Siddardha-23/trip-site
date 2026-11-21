// Server-side Supabase clients. Two flavors:
//  - createServerClientRSC(): anon-key client with cookie handling, for server
//    components / route handlers that only read.
//  - createServiceRoleClient(): service-role client (bypasses RLS) for
//    editor-gated writes inside route handlers. Service-role key is server-only.
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when both public Supabase env vars are set (real backend mode). */
export const supabaseAvailable = Boolean(url && anonKey);

/** True when the service-role key is present (server-side writes possible). */
export const serviceRoleAvailable = Boolean(url && serviceRoleKey);

/**
 * Anon-key server client with Next.js cookie handling. Returns null in mock
 * mode. Safe for reads from server components and route handlers.
 */
export async function createServerClientRSC() {
  if (!supabaseAvailable) return null;
  const cookieStore = await cookies();
  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll called from a Server Component; safe to ignore when a
          // middleware/route handler refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Service-role client that bypasses RLS. SERVER ONLY. Returns null when the
 * service-role key is absent. Use strictly inside editor-gated route handlers.
 */
export function createServiceRoleClient() {
  if (!serviceRoleAvailable) return null;
  return createSupabaseClient(url!, serviceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
