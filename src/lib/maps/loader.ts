// Google Maps JS API loader wrapper. Keyed on NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
// which is safe to expose ONLY when the key is HTTP-referrer-restricted with a
// quota cap (see .env.local.example). When the key is absent, `mapsAvailable`
// is false and callers must fall back to the static route panel — nothing here
// throws so build and mock mode never crash.
"use client";

import { Loader } from "@googlemaps/js-api-loader";

// Google invokes this global (no arguments) when the Maps key is rejected; the
// specific code (RefererNotAllowedMapError, ApiNotActivatedMapError, …) is only
// logged to the console. @types/google.maps does not declare it on Window.
declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/** True when a Maps key is configured (live-map mode). */
export const mapsAvailable = Boolean(apiKey);

let loaderPromise: Promise<typeof google.maps> | null = null;

/**
 * Human-readable reason for the last Google Maps authentication failure, or
 * null if none has been captured. The SPECIFIC auth codes
 * (RefererNotAllowedMapError, ApiNotActivatedMapError, BillingNotEnabled, …)
 * never reach the loader promise — Google surfaces them only by invoking the
 * global `window.gm_authFailure` callback and logging the code to the console.
 * We register that callback once so the UI can show the real cause.
 */
let authError: string | null = null;
const authErrorListeners = new Set<(reason: string) => void>();
let authFailureRegistered = false;

/** The generic message shown to the user when no specific cause was captured. */
const GENERIC_AUTH_MESSAGE =
  "Google rejected the Maps request — check that the Maps JavaScript API is enabled and the key's HTTP-referrer restrictions allow this domain.";

/** Short, human-readable explanations for the specific Google auth codes. */
const AUTH_CODE_HINTS: Record<string, string> = {
  RefererNotAllowedMapError:
    "this domain is not allowed by the Maps key's HTTP-referrer restrictions.",
  ApiNotActivatedMapError:
    "the Maps JavaScript API is not enabled for this key's project.",
  ApiTargetBlockedMapError:
    "this API is blocked for the Maps key by an API restriction.",
  InvalidKeyMapError: "the Maps key is invalid.",
  MissingKeyMapError: "no Maps key was supplied.",
  BillingNotEnabledMapError:
    "billing is not enabled for this key's Google Cloud project.",
  ExpiredKeyMapError: "the Maps key has expired.",
};

/** Build a human-readable reason from a Google auth code, if we recognize it. */
function describeAuthCode(code: string): string {
  const hint = AUTH_CODE_HINTS[code];
  return hint ? `${code} — ${hint}` : code;
}

function recordAuthError(reason: string): void {
  // Prefer a specific code (from the console capture) over the generic message.
  if (authError && authError !== GENERIC_AUTH_MESSAGE) return;
  authError = reason;
  for (const listener of authErrorListeners) listener(authError);
}

/**
 * Register the global `window.gm_authFailure` callback exactly once, plus a
 * one-time console.error intercept. Google calls `gm_authFailure` with NO
 * arguments when the key is rejected, so the specific code
 * (RefererNotAllowedMapError, ApiNotActivatedMapError, …) only arrives in the
 * message Google logs via console.error. We read the code from that log and
 * fall back to a generic-but-actionable message if it is unavailable.
 */
function registerAuthFailureHandler(): void {
  if (authFailureRegistered || typeof window === "undefined") return;
  authFailureRegistered = true;

  const originalError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const text = args
      .map((a) => (typeof a === "string" ? a : ""))
      .join(" ");
    const match = /Google Maps JavaScript API error:\s*([A-Za-z]+)/.exec(text);
    if (match) recordAuthError(describeAuthCode(match[1]));
    originalError(...args);
  };

  window.gm_authFailure = () => {
    recordAuthError(authError ?? GENERIC_AUTH_MESSAGE);
  };
}

/** Current captured Maps auth-failure reason, or null if none. */
export function getMapsAuthError(): string | null {
  return authError;
}

/**
 * Subscribe to Maps auth-failure notifications. The callback fires with the
 * human-readable reason when `window.gm_authFailure` is invoked. Returns an
 * unsubscribe function. Registering a listener also ensures the global handler
 * is installed.
 */
export function subscribeMapsAuthError(
  listener: (reason: string) => void,
): () => void {
  registerAuthFailureHandler();
  authErrorListeners.add(listener);
  if (authError) listener(authError);
  return () => {
    authErrorListeners.delete(listener);
  };
}

/**
 * Load the Google Maps libraries the route map needs (maps, marker, routes,
 * geometry) once and cache the resolved `maps` namespace. Returns null in mock
 * mode (no key), so callers must guard on `mapsAvailable`. Nothing here throws:
 * a rejected loader promise is surfaced to the caller's `.catch`, and specific
 * auth-failure codes arrive via the `window.gm_authFailure` capture above.
 */
export function loadGoogleMaps(): Promise<typeof google.maps> | null {
  if (!mapsAvailable) return null;
  if (!loaderPromise) {
    registerAuthFailureHandler();
    const loader = new Loader({
      apiKey: apiKey!,
      version: "weekly",
      libraries: ["maps", "marker", "routes", "geometry"],
    });
    loaderPromise = loader
      .importLibrary("maps")
      .then((maps) => maps as unknown as typeof google.maps);
  }
  return loaderPromise;
}
