"use client";

import { mapsAvailable } from "@/lib/maps/loader";
import { RouteMap } from "@/components/map/RouteMap";
import { RouteFallback } from "@/components/map/RouteFallback";

/**
 * Chooses the live Google map when a Maps key is configured, or the static
 * route panel otherwise. Both NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and its absence
 * are resolved at build time for this client bundle, so mock-mode builds render
 * the fallback with no runtime error.
 */
export function MapSection() {
  return mapsAvailable ? <RouteMap /> : <RouteFallback />;
}
