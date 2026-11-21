// Shared editor-auth helpers used by the route handlers.
import { timingSafeEqual } from "node:crypto";

/** httpOnly cookie name set when editor mode is unlocked. */
export const EDITOR_COOKIE = "trip_editor";
export const EDITOR_COOKIE_VALUE = "1";

/**
 * Constant-time comparison of a submitted password against EDITOR_PASSWORD.
 * Returns false when the env var is unset so mock mode cannot be unlocked.
 */
export function checkEditorPassword(submitted: string): boolean {
  const expected = process.env.EDITOR_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(submitted, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    // Still run a compare against a same-length buffer to avoid leaking length
    // via early return timing, then fail.
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}
