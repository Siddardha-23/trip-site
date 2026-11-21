import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { trip } from "@/lib/seed/trip-seed";

const WEEKDAY_SHORT: Record<string, string> = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** The route ledger: where each night goes, with each leg's miles + drive-time. */
export function RouteLedger() {
  const nights = trip.days.filter((day) => day.overnight);

  return (
    <section>
      <SectionHeader
        title="Route ledger"
        subtitle="Where each night goes, and the drive that gets you there."
      />
      <ol className="flex flex-col gap-3">
        {nights.map((day) => {
          const totalMiles = day.legs.reduce((sum, leg) => sum + leg.miles, 0);
          return (
            <li key={day.id}>
              <Card className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-ember-600">
                      Night {day.dayNumber} · {WEEKDAY_SHORT[day.weekday]},{" "}
                      {formatDate(day.date)}
                    </span>
                    <Link
                      href={`/itinerary/${day.dayNumber}`}
                      className="text-base font-semibold text-ink-900 hover:text-clay-700"
                    >
                      {day.overnight}
                    </Link>
                  </div>
                  {totalMiles > 0 ? (
                    <Badge tone="sand">{totalMiles} mi</Badge>
                  ) : (
                    <Badge tone="ember">City day</Badge>
                  )}
                </div>
                <p className="text-sm text-muted">{day.summary}</p>
              </Card>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
