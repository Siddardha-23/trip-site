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

      new g.Polyline({
        path,
        map,
        strokeColor: "#e2613a",
        strokeOpacity: 0.9,
        strokeWeight: 4,
      });

      const bounds = new g.LatLngBounds();
      for (const point of ROUTE_POINTS) {
        bounds.extend(point);
        new g.Marker({
          position: point,
          map,
          title: point.label,
          label: {
            text: point.label,
            fontSize: "11px",
            className: "map-point-label",
          },
        });
      }
      map.fitBounds(bounds, 48);

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

      // Animate the car looping along the polyline. `progress` spans the whole
      // route in [0, segments); the integer part selects the segment. Guard the
      // index so floating-point accumulation can never make it reach the final
      // point (where path[i + 1] would be undefined and Maps throws on it).
      const segments = path.length - 1;
      const speed = 0.0045; // fraction of a segment per frame
      let progress = 0;

      const tick = () => {
        progress += speed;
        if (progress >= segments) progress = 0;
        const i = Math.min(Math.floor(progress), segments - 1);
        const t = progress - i;
        car.setPosition(lerp(path[i], path[i + 1], t));
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
    <div className="flex flex-col gap-3">
      <div className="relative">
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
