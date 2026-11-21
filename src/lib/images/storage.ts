// Helpers for the Supabase Storage 'photos' bucket. A Photo record stores a
// bucket path in `photo.url`; this resolves it to a public URL for rendering.
// In mock mode (no Supabase) photos carry null urls and render as placeholders.
import { createClient, supabaseAvailable } from "@/lib/supabase/client";

/** The public Storage bucket photos are uploaded to. */
export const PHOTOS_BUCKET = "photos";

/**
 * Resolve a stored photo path to a displayable URL. Returns null when there is
 * no path (seeded placeholder) or Supabase is not configured. A value that is
 * already an absolute URL is returned unchanged.
 */
export function resolvePhotoUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!supabaseAvailable) return null;
  const client = createClient();
  if (!client) return null;
  const { data } = client.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
