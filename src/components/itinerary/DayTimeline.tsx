import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { places } from "@/lib/seed/trip-seed";
import type { Day, RouteLeg, Stop } from "@/lib/types";

/** Resolve a stop's display location name (via its place, else its own name). */
function stopPlaceName(stop: Stop): string {
  if (stop.placeId) {
    const place = places.find((p) => p.id === stop.placeId);
    if (place) return place.name;
  }
  return stop.name;
}

/** Loose match between a leg endpoint label and a stop's place/name. */
function labelMatches(legEndpoint: string, stopLabel: string): boolean {
  const a = legEndpoint.toLowerCase();
  const b = stopLabel.toLowerCase();
  return a.includes(b) || b.includes(a);
}

/**
 * Read-only day timeline: stops in order with their times, and a DRIVE OVERLAY
 * between consecutive stops carrying the matching leg's route/miles/drive-time.
 * Server component (no cookies/headers) so the page stays in the PPR shell.
 *
 * This is presentational only — it does NOT edit stops. The editable
 * StopsLibrary island still owns add/remove via the repository.
 */
export function DayTimeline({ day }: { day: Day }) {
  const { stops, legs } = day;

  if (stops.length === 0) {
    return (
      <Card className="text-sm text-muted">
        No stops planned for this day yet.
      </Card>
    );
  }

  // Try to place each leg inline between the consecutive stops it connects.
  const usedLegs = new Set<string>();
  const overlayByIndex = new Map<number, RouteLeg>();

  for (let i = 0; i < stops.length - 1; i += 1) {
    const fromLabel = stopPlaceName(stops[i]);
    const toLabel = stopPlaceName(stops[i + 1]);
    const match = legs.find(
      (leg) =>
        !usedLegs.has(leg.id) &&
        labelMatches(leg.from, fromLabel) &&
        labelMatches(leg.to, toLabel),
    );
    if (match) {
      overlayByIndex.set(i, match);
      usedLegs.add(match.id);
    }
  }

  const unmatchedLegs = legs.filter((leg) => !usedLegs.has(leg.id));
  // If NO leg mapped to a stop gap, fall back to a single drive band listing
  // all the day's legs (ambiguous mapping) rather than inventing placement.
  const useFallbackBand = legs.length > 0 && overlayByIndex.size === 0;

  return (
    <div className="flex flex-col gap-3">
      {useFallbackBand ? <DriveBand legs={legs} /> : null}

      <ol className="flex flex-col gap-3">
        {stops.map((stop, i) => (
          <li key={stop.id} className="flex flex-col gap-3">
            <StopItem stop={stop} />
            {overlayByIndex.has(i) ? (
              <DriveOverlay leg={overlayByIndex.get(i)!} />
            ) : null}
          </li>
        ))}
      </ol>

      {!useFallbackBand && unmatchedLegs.length > 0 ? (
        <DriveBand legs={unmatchedLegs} heading="Other driving this day" />
      ) : null}
    </div>
  );
}

function StopItem({ stop }: { stop: Stop }) {
  return (
    <Card className="flex flex-col gap-1">
      <div className="flex items-start justify-between gap-3">
        <span className="font-semibold text-ink-900">{stop.name}</span>
        {stop.time ? (
          <time className="shrink-0 text-sm font-medium text-[color:var(--day-accent)]">
            {stop.time}
          </time>
        ) : null}
      </div>
      {stop.description ? (
        <p className="text-sm text-ink-800">{stop.description}</p>
      ) : null}
    </Card>
  );
}

/** Drive overlay shown inline between two consecutive stops. */
function DriveOverlay({ leg }: { leg: RouteLeg }) {
  return (
    <div className="day-drive-band mx-auto flex w-full flex-col gap-1 rounded-xl px-4 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink-800">
          <span aria-hidden="true">↓ </span>
          Drive · {leg.from} → {leg.to}
        </span>
        <span className="text-sm text-muted">
          {leg.miles} mi · {leg.driveTime}
          {leg.departTime ? ` · depart ${leg.departTime}` : ""}
        </span>
      </div>
      {leg.notes ? <p className="text-xs text-muted">{leg.notes}</p> : null}
    </div>
  );
}

/** Fallback drive band listing legs when stop-to-leg mapping is ambiguous. */
function DriveBand({
  legs,
  heading = "Driving this day",
}: {
  legs: RouteLeg[];
  heading?: string;
}) {
  return (
    <div className="day-drive-band flex flex-col gap-2 rounded-xl px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-800">
        {heading}
      </span>
      {legs.map((leg) => (
        <div key={leg.id} className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-ink-900">
              {leg.from} → {leg.to}
            </span>
            <span className="flex items-center gap-2 text-sm text-muted">
              {leg.miles} mi · {leg.driveTime}
              {leg.departTime ? (
                <Badge tone="ember">Depart {leg.departTime}</Badge>
              ) : null}
            </span>
          </div>
          {leg.notes ? <p className="text-xs text-muted">{leg.notes}</p> : null}
        </div>
      ))}
    </div>
  );
}
