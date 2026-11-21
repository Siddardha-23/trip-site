import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { LegList } from "@/components/itinerary/LegList";
import { StopsLibrary } from "@/components/places/StopsLibrary";
import { trip } from "@/lib/seed/trip-seed";

export function generateStaticParams() {
  return trip.days.map((day) => ({ day: String(day.dayNumber) }));
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayParam } = await params;
  const day = trip.days.find((d) => String(d.dayNumber) === dayParam);
  if (!day) notFound();

  const formattedDate = new Date(`${day.date}T00:00:00`).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" },
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <Link
          href="/itinerary"
          className="text-sm text-muted hover:text-clay-700"
        >
          ← All days
        </Link>
        <span className="text-xs font-medium uppercase tracking-wide text-ember-600">
          Day {day.dayNumber} · {formattedDate}
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
          {day.title}
        </h1>
        <p className="text-muted">{day.summary}</p>
      </div>

      <section>
        <SectionHeader title="Driving" subtitle="Legs, mileage and departure targets." />
        <LegList legs={day.legs} />
      </section>

      <section>
        <SectionHeader
          title="Stops"
          subtitle="The places and activities for this day. Unlock editing to add your own."
        />
        <StopsLibrary seedDay={day} />
      </section>

      {day.notes.length > 0 ? (
        <section>
          <SectionHeader title="Notes & warnings" />
          <Card>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-ink-800">
              {day.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
