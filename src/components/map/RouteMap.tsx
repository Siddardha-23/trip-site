"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getMapsAuthError,
  loadGoogleMaps,
  subscribeMapsAuthError,
} from "@/lib/maps/loader";
import { ROUTE_CENTER, ROUTE_POINTS } from "@/lib/maps/route";
import type { LatLng } from "@/lib/maps/route";
import {
  joinLiveLocation,
  type LivePosition,
} from "@/lib/maps/presence";
import { supabaseAvailable } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

/** A car-shaped marker icon drawn as an SVG data URL. */
const CAR_ICON =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#ffffff" stroke="#e2613a" stroke-width="2"/>
      <path d="M5 13.5 6 10a2 2 0 0 1 1.9-1.4h8.2A2 2 0 0 1 18 10l1 3.5v3a.5.5 0 0 1-.5.5H17a1 1 0 0 1-2 0H9a1 1 0 0 1-2 0H5.5a.5.5 0 0 1-.5-.5v-3Z" fill="#e2613a"/>
      <circle cx="8" cy="16.5" r="1.1" fill="#1f2937"/>
      <circle cx="16" cy="16.5" r="1.1" fill="#1f2937"/>
    </svg>`,
  );

/**
 * Build a numbered teardrop pin as an SVG data URL, styled to the app's warm
 * canyon palette so each of the ordered stops reads clearly on the map and on
 * mobile. `n` is the 1-based travel-order number shown inside the pin.
 */
function numberedPinIcon(n: number): string {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e8915b"/>
            <stop offset="100%" stop-color="#c4531f"/>
          </linearGradient>
        </defs>
        <path d="M20 1C10.6 1 3 8.6 3 18c0 11.7 14.4 29.3 15 30a2.6 2.6 0 0 0 4 0c.6-.7 15-18.3 15-30C37 8.6 29.4 1 20 1Z"
          fill="url(#g)" stroke="#ffffff" stroke-width="2.5"/>
        <circle cx="20" cy="18" r="10.5" fill="#ffffff"/>
        <text x="20" y="18" text-anchor="middle" dominant-baseline="central"
          font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
          font-size="13" font-weight="700" fill="#9a3f1a">${n}</text>
      </svg>`,
    )
  );
}

/** True when the user asks for reduced motion (no window = assume motion OK). */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Linear interpolation between two coordinates. */
function lerp(a: LatLng, b: LatLng, t: number): LatLng {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

/**
 * Live Google Map: draws the route polyline through the overnight-base anchors,
 * animates a car marker looping along the polyline via requestAnimationFrame,
 * and (when Supabase is available) offers an opt-in live-location toggle that
 * publishes this session's position and renders other participants' markers.
 *
 * Only mounted when mapsAvailable is true (the page renders the fallback
 * otherwise), so the Maps API is always configured here.
 */
export function RouteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [authError, setAuthError] = useState<string | null>(
    getMapsAuthError(),
  );
  const [sharing, setSharing] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  // Mutable refs for imperative Maps objects / animation handles.
  const mapRef = useRef<google.maps.Map | null>(null);
  const carRef = useRef<google.maps.Marker | null>(null);
  const traveledRef = useRef<google.maps.Polyline | null>(null);
  const rafRef = useRef<number | null>(null);
  const peerMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const liveRef = useRef<ReturnType<typeof joinLiveLocation>>(null);
  const watchIdRef = useRef<number | null>(null);
  // Stable per-session id, assigned in an effect so no impure call runs during
  // render (geolocation / Realtime are client-only, so this is set in time).
  const selfIdRef = useRef<string>("");

  useEffect(() => {
    selfIdRef.current =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s-${Date.now()}`;
  }, []);

  // Capture the specific Google auth-failure reason (RefererNotAllowedMapError,
  // ApiNotActivatedMapError, …) delivered via window.gm_authFailure. When it
  // fires the map never finishes authenticating, so also show the error state.
  useEffect(() => {
    return subscribeMapsAuthError((reason) => {
      setAuthError(reason);
      setError(true);
    });
  }, []);

  // Build the map, polyline and animated car marker.
  useEffect(() => {
    const maps = loadGoogleMaps();
    if (!maps) return;
    let cancelled = false;

    void maps.then((g) => {
      if (cancelled || !containerRef.current) return;

      const map = new g.Map(containerRef.current, {
        center: ROUTE_CENTER,
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      mapRef.current = map;

      const path = ROUTE_POINTS.map((p) => ({ lat: p.lat, lng: p.lng }));

      // Base route: the full planned polyline, drawn faint so the brighter
      // "traveled" line layered on top reads as progress.
      new g.Polyline({
        path,
        map,
        strokeColor: "#c4531f",
        strokeOpacity: 0.35,
        strokeWeight: 4,
      });

      // Traveled portion: a brighter line the car "paints" as it moves. Starts
      // empty and is refilled each loop. The geometry library is imported by
      // the loader, so this constructor is always defined here.
      const traveled = new g.Polyline({
        path: [],
        map,
        strokeColor: "#dd6b35",
        strokeOpacity: 1,
        strokeWeight: 5,
        zIndex: 5,
      });
      traveledRef.current = traveled;

      const bounds = new g.LatLngBounds();
      // Numbered, labeled pins in travel order (1..7). Each pin is a warm-theme
      // SVG with a legible number, plus a label chip anchored below it so an
      // unknown visitor reads the sequence at a glance. ROUTE_POINTS is a fixed
      // 7-element array, so index + 1 is always a valid stop number.
      ROUTE_POINTS.forEach((point, index) => {
        bounds.extend(point);
        new g.Marker({
          position: point,
          map,
          title: `${index + 1}. ${point.label}`,
          icon: {
            url: numberedPinIcon(index + 1),
            scaledSize: new g.Size(40, 52),
            anchor: new g.Point(20, 50),
            labelOrigin: new g.Point(20, 62),
          },
          label: {
            text: point.label,
            fontSize: "11px",
            fontWeight: "600",
            className: "map-point-label",
          },
          zIndex: 10 + index,
        });
      });
      map.fitBounds(bounds, 56);

      // Respect reduced-motion: no car animation, but still show the car parked
      // at the start and the route fully drawn so the map stays informative.
      const reduceMotion = prefersReducedMotion();

      const car = new g.Marker({
        position: path[0],
        map,
        icon: {
          url: CAR_ICON,
          scaledSize: new g.Size(34, 34),
          anchor: new g.Point(17, 17),
        },
        zIndex: 1000,
      });
      carRef.current = car;

      if (reduceMotion) {
        // Static view: show the whole route as "traveled" and skip rAF.
        traveled.setPath(path);
        setReady(true);
        return;
      }

      // Animate the car looping along the polyline. `progress` spans the whole
      // route in [0, segments); the integer part selects the segment. Guard the
      // index so floating-point accumulation can never make it reach the final
      // point (where path[i + 1] would be undefined and Maps throws on it).
      const segments = path.length - 1;
      const speed = 0.0045; // fraction of a segment per frame
      let progress = 0;

      const tick = () => {
        progress += speed;
        if (progress >= segments) {
          progress = 0;
          traveled.setPath([]);
        }
        const i = Math.min(Math.floor(progress), segments - 1);
        const t = progress - i;
        const pos = lerp(path[i], path[i + 1], t);
        car.setPosition(pos);
        // Emphasize the traveled portion: all fully-passed anchors plus the
        // car's current position. path.slice(0, i + 1) is always in-range
        // because i is clamped to [0, segments - 1].
        traveled.setPath([...path.slice(0, i + 1), pos]);
        rafRef.current = requestAnimationFrame(tick);
      };
      if (segments > 0) rafRef.current = requestAnimationFrame(tick);

      setReady(true);
    }).catch(() => {
      if (!cancelled) setError(true);
    });

    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Render / update a peer's marker.
  const upsertPeer = useCallback((pos: LivePosition) => {
    const map = mapRef.current;
    if (!map || typeof google === "undefined") return;
    const existing = peerMarkersRef.current.get(pos.id);
    if (existing) {
      existing.setPosition(pos);
      return;
    }
    const marker = new google.maps.Marker({
      position: pos,
      map,
      title: "A traveler",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: "#2563eb",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });
    peerMarkersRef.current.set(pos.id, marker);
  }, []);

  const stopSharing = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined") {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    liveRef.current?.leave();
    liveRef.current = null;
    for (const marker of peerMarkersRef.current.values()) marker.setMap(null);
    peerMarkersRef.current.clear();
    setSharing(false);
  }, []);

  const startSharing = useCallback(() => {
    setLocError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocError("This device cannot share location.");
      return;
    }
    const handle = joinLiveLocation(selfIdRef.current, upsertPeer);
    if (!handle) {
      setLocError("Live location needs the shared backend to be configured.");
      return;
    }
    liveRef.current = handle;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (p) => {
        const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
        handle.publish(pos);
        mapRef.current?.panTo(pos);
      },
      () => {
        setLocError("Location permission denied.");
        stopSharing();
      },
      { enableHighAccuracy: true, maximumAge: 10_000 },
    );
    setSharing(true);
  }, [stopSharing, upsertPeer]);

  // Tear down live-location on unmount.
  useEffect(() => () => stopSharing(), [stopSharing]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
      <div className="relative lg:flex-1">
        <div
          ref={containerRef}
          className="h-[60vh] min-h-[360px] w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-sand-100"
          aria-label="Route map"
        />
        {!ready && !error ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted">
            Loading the map…
          </div>
        ) : null}
        {error ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted">
            {authError ??
              "The map could not load. Check the Maps key and its referrer restrictions."}
          </div>
        ) : null}
      </div>

      {/* Ordered legend so an unknown visitor instantly grasps the route. The
          numbers mirror the numbered pins on the map (1..7 in travel order). */}
      <nav
        aria-label="Trip stops in order"
        className="lg:w-64 lg:shrink-0"
      >
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          The route · 7 stops
        </h3>
        <ol className="flex flex-col gap-1.5">
          {ROUTE_POINTS.map((point, index) => (
            <li
              key={point.id}
              className="flex items-center gap-2.5 rounded-xl border border-ember-400/20 bg-gradient-to-r from-glow-300/30 to-sand-100 px-3 py-2"
            >
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-ember-400 to-ember-600 text-xs font-bold text-white"
              >
                {index + 1}
              </span>
              <span className="text-sm font-medium text-ink-800">
                {point.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>
      </div>

      {supabaseAvailable ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={sharing ? "outline" : "primary"}
            size="sm"
            onClick={sharing ? stopSharing : startSharing}
          >
            {sharing ? "Stop sharing my location" : "Share my live location"}
          </Button>
          {sharing ? (
            <span className="text-sm text-muted">
              Others on the trip can see your marker while this is on.
            </span>
          ) : (
            <span className="text-sm text-muted">
              Opt in to show your position to the group.
            </span>
          )}
          {locError ? (
            <span className="text-sm text-clay-700">{locError}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
