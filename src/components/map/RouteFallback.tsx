import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { trip } from "@/lib/seed/trip-seed";

/**
 * Degraded view shown when no Maps key is configured (mapsAvailable === false).
 * Lists the route legs from the seed so the page is never blank and never
 * throws. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to replace this with the live map.
 */
export function RouteFallback() {
  const legs = trip.days.flatMap((day) =>
    day.legs.map((leg) => ({ day, leg })),
  );

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-2 border-dashed">
        <div className="flex items-center gap-2">
          <Badge tone="ember">Static route</Badge>
          <span className="text-sm font-medium text-ink-900">
            Add a Maps key to see the live map
          </span>
        </div>
        <p className="text-sm text-muted">
          Set <code className="rounded bg-sand-100 px-1 py-0.5 text-xs">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          (referrer-restricted, with a quota cap) to draw the route on Google
          Maps with an animated car marker and opt-in live location. Until then,
          here is every driving leg from Tempe to San Francisco.
        </p>
      </Card>

      <ol className="flex flex-col gap-3">
        {legs.map(({ day, leg }) => (
          <li key={leg.id}>
            <Card className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-medium uppercase tracking-wide text-ember-600">
                    Day {day.dayNumber} · {day.weekday}
                  </span>
                  <span className="text-base font-semibold text-ink-900">
                    {leg.from} → {leg.to}
                  </span>
                </div>
                <Badge tone="sand">{leg.miles} mi</Badge>
              </div>
              <p className="text-sm text-muted">
                {leg.driveTime}
                {leg.departTime ? ` · depart ${leg.departTime}` : ""}
              </p>
              {leg.notes ? (
                <p className="text-sm text-muted">{leg.notes}</p>
              ) : null}
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
