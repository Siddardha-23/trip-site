// Route geometry for the map. The coordinates below are fixed geographic
// locations of the named overnight bases / anchor landmarks from the seed
// itinerary (Tempe, Sedona, Grand Canyon South Rim, San Diego, Los Angeles /
// Griffith, San Francisco). They are public place coordinates used only to draw
// the overview polyline and position the car marker; they are NOT trip figures
// (mileage / drive-time) — those stay transcribed verbatim in the seed.

export interface LatLng {
  lat: number;
  lng: number;
}

/** A point along the overview route, tied back to a seed place where one exists. */
export interface RoutePoint extends LatLng {
  /** Stable key (matches a seed place id where applicable). */
  id: string;
  label: string;
}

/**
 * Ordered anchor points of the one-way route. Mather Point is used as the
 * South Rim anchor and Griffith Observatory as the Los Angeles anchor, matching
 * the itinerary's named stops.
 */
export const ROUTE_POINTS: RoutePoint[] = [
  { id: "tempe", label: "Tempe", lat: 33.4255, lng: -111.94 },
  { id: "sedona", label: "Sedona", lat: 34.8697, lng: -111.761 },
  { id: "south-rim", label: "Grand Canyon South Rim", lat: 36.0617, lng: -112.1077 },
  { id: "san-diego", label: "San Diego", lat: 32.7157, lng: -117.1611 },
  { id: "griffith-observatory", label: "Los Angeles · Griffith Observatory", lat: 34.1184, lng: -118.3004 },
  { id: "san-francisco", label: "San Francisco", lat: 37.7749, lng: -122.4194 },
];

/** Geographic center used to frame the default map view. */
export const ROUTE_CENTER: LatLng = { lat: 35.2, lng: -116.5 };

/** One leg of the overview route (pairing consecutive anchor points). */
export interface RouteSegment {
  from: RoutePoint;
  to: RoutePoint;
}

/** Consecutive anchor-point pairs, in travel order. */
export const ROUTE_SEGMENTS: RouteSegment[] = ROUTE_POINTS.slice(0, -1).map(
  (from, i) => ({ from, to: ROUTE_POINTS[i + 1] }),
);
