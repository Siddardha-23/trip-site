import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Day } from "@/lib/types";

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
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** One day's summary card in the itinerary overview. */
export function DayCard({ day }: { day: Day }) {
  const totalMiles = day.legs.reduce((sum, leg) => sum + leg.miles, 0);

  return (
    <Link href={`/itinerary/${day.dayNumber}`} className="block">
      <Card className="flex flex-col gap-2 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-ember-600">
              Day {day.dayNumber} · {WEEKDAY_SHORT[day.weekday]},{" "}
              {formatDate(day.date)}
            </span>
            <span className="text-base font-semibold text-ink-900">
              {day.title}
            </span>
          </div>
          {totalMiles > 0 ? (
            <Badge tone="sand">{totalMiles} mi</Badge>
          ) : (
            <Badge tone="ember">City day</Badge>
          )}
        </div>
        <p className="text-sm text-muted">{day.summary}</p>
        {day.overnight ? (
          <p className="text-xs text-muted">Overnight · {day.overnight}</p>
        ) : null}
      </Card>
    </Link>
  );
}
