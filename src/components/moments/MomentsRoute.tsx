import { ROUTE_POINTS } from "@/lib/maps/route";
import type { Trip } from "@/lib/types";

/**
 * A compact, text-based route strip for the recap. Uses the fixed anchor
 * points from the map route and the trip's transcribed intercity totals.
 */
export function MomentsRoute({ trip }: { trip: Trip }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10">
      <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-muted">
        The route
      </h2>
      <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-sm">
        {ROUTE_POINTS.map((point, i) => (
          <li key={point.id} className="flex items-center gap-2">
            <span className="rounded-full bg-sand-100 px-3 py-1 font-medium text-ink-900">
              {point.label}
            </span>
            {i < ROUTE_POINTS.length - 1 ? (
              <span aria-hidden className="text-ember-500">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-center text-sm text-muted">
        About {trip.totalIntercityMiles.toLocaleString()} mi ·{" "}
        {trip.totalDrivingHours} hr of driving · {trip.overnightSummary}
      </p>
    </section>
  );
}
