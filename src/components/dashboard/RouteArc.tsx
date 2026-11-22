import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDayTheme } from "@/lib/theme/day-themes";
import { trip } from "@/lib/seed/trip-seed";

/** One node on the visual journey strip. */
interface ArcStop {
  /** Stable key for React. */
  key: string;
  /** Plain-language role, e.g. "Start" or "Night 1". */
  role: string;
  /** Where you are, e.g. "Tempe" or "Williams / Grand Canyon". */
  place: string;
  /** Short date label, e.g. "Dec 27". */
  when: string;
  /** Day page to link to, or null for non-day markers (start/split). */
  href: string | null;
  /** Theme accent color for the node dot; a neutral default when absent. */
  accent: string;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Plain-language place label for an overnight base. */
const PLACE_LABEL: Record<string, string> = {
  "Williams, AZ": "Williams / Grand Canyon",
  "San Diego": "San Diego",
  "Los Angeles": "Los Angeles",
  "Monterey / Carmel, CA": "Monterey / Carmel",
  "San Francisco, CA": "San Francisco",
};

/** Build the ordered journey strip from the trip seed so it never drifts. */
function buildArc(): ArcStop[] {
  const nights = trip.days.filter((day) => day.overnight);
  const checkout = trip.days.find((day) => day.overnight === null);

  const stops: ArcStop[] = [];

  // Start marker: the first leg's origin is the trip start town.
  const firstFrom = nights[0]?.legs[0]?.from ?? "Tempe";
  stops.push({
    key: "start",
    role: "Start",
    place: firstFrom,
    when: formatDate(trip.startDate),
    href: null,
    accent: getDayTheme(nights[0]?.theme?.key).accent,
  });

  // One node per overnight base, linking to its day page.
  for (const day of nights) {
    stops.push({
      key: day.id,
      role: `Night ${day.dayNumber}`,
      place: PLACE_LABEL[day.overnight ?? ""] ?? day.overnight ?? "",
      when: formatDate(day.date),
      href: `/itinerary/${day.dayNumber}`,
      accent: getDayTheme(day.theme?.key).accent,
    });
  }

  // End marker: everyone splits on checkout day.
  if (checkout) {
    stops.push({
      key: checkout.id,
      role: "Split",
      place: "Everyone splits",
      when: formatDate(checkout.date),
      href: `/itinerary/${checkout.dayNumber}`,
      accent: getDayTheme(nights[nights.length - 1]?.theme?.key).accent,
    });
  }

  return stops;
}

/**
 * The visual route-arc overview. Server component (reads the seed directly, no
 * cookies/headers) so it stays in the PPR static shell. It renders the whole
 * ordered journey — Tempe → Williams/Grand Canyon → San Diego → Los Angeles →
 * Monterey → San Francisco → split — as a mobile-first vertical strip that
 * becomes a horizontal track on wider screens, with plain-language labels and a
 * link to each day so a first-time visitor grasps the trip at a glance.
 */
export function RouteArc() {
  const stops = buildArc();

  return (
    <section>
      <SectionHeader
        title="The whole trip, in order"
        subtitle="Six days of driving, from Arizona red rocks to the Big Sur coast and San Francisco. Tap any stop for that day."
      />
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0 sm:overflow-x-auto sm:pb-2">
        {stops.map((stop, i) => {
          const isLink = stop.href !== null;
          const inner = (
            <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
              <span
                aria-hidden
                className="mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ring-surface sm:mt-0"
                style={{ backgroundColor: stop.accent }}
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-ember-600">
                  {stop.role} · {stop.when}
                </span>
                <span className="text-sm font-semibold text-ink-900">
                  {stop.place}
                </span>
              </div>
            </div>
          );

          return (
            <li
              key={stop.key}
              className="relative flex items-stretch sm:flex-1 sm:min-w-36 sm:flex-col"
            >
              {/* Connector line to the next node: vertical on mobile, horizontal on desktop. */}
              {i < stops.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-[5px] top-6 h-full w-px bg-sand-200 sm:left-1/2 sm:top-[7px] sm:h-px sm:w-full"
                />
              ) : null}
              {isLink ? (
                <Link
                  href={stop.href as string}
                  className="relative z-10 rounded-xl px-1 py-1 transition-colors hover:bg-sand-100 sm:px-2"
                >
                  {inner}
                </Link>
              ) : (
                <div className="relative z-10 px-1 py-1 sm:px-2">{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
