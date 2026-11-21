// Google Maps JS API loader wrapper. Keyed on NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
// which is safe to expose ONLY when the key is HTTP-referrer-restricted with a
// quota cap (see .env.local.example). When the key is absent, `mapsAvailable`
// is false and callers must fall back to the static route panel — nothing here
// throws so build and mock mode never crash.
"use client";

import { Loader } from "@googlemaps/js-api-loader";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/** True when a Maps key is configured (live-map mode). */
export const mapsAvailable = Boolean(apiKey);

let loaderPromise: Promise<typeof google.maps> | null = null;

/**
 * Load the Google Maps `maps` library once and cache the promise. Returns null
 * in mock mode (no key), so callers must guard on `mapsAvailable`.
 */
export function loadGoogleMaps(): Promise<typeof google.maps> | null {
  if (!mapsAvailable) return null;
  if (!loaderPromise) {
    const loader = new Loader({ apiKey: apiKey!, version: "weekly" });
    loaderPromise = loader.importLibrary("maps") as unknown as Promise<
      typeof google.maps
    >;
  }
  return loaderPromise;
}
