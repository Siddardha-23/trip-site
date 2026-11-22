import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DayHero } from "@/components/itinerary/DayHero";
import { DayTimeline } from "@/components/itinerary/DayTimeline";
import { DayPhotoStrip } from "@/components/itinerary/DayPhotoStrip";
import { DayInfoCards } from "@/components/itinerary/DayInfoCards";
import { DayExperiences } from "@/components/itinerary/DayExperiences";
import { StopsLibrary } from "@/components/places/StopsLibrary";
import { dayThemeVars } from "@/lib/theme/day-themes";
import { trip, photos } from "@/lib/seed/trip-seed";

export function generateStaticParams() {
  return trip.days.map((day) => ({ day: String(day.dayNumber) }));
}

export default function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  return (
    <Suspense>
      <DayContent params={params} />
    </Suspense>
  );
}

async function DayContent({ params }: { params: Promise<{ day: string }> }) {
  const { day: dayParam } = await params;
  const day = trip.days.find((d) => String(d.dayNumber) === dayParam);
  if (!day) notFound();

  const dayPhotos = photos.filter((photo) => photo.dayId === day.id);

  // Set the theme vars once on the wrapper so the hero, timeline drive bands,
  // info cards and photo fallbacks all read this day's --day-* palette.
  return (
    <div style={dayThemeVars(day.theme?.key)} className="flex flex-col gap-8">
      <Link
        href="/itinerary"
        className="text-sm text-muted hover:text-[color:var(--day-accent)]"
      >
        ← All days
      </Link>

      <DayHero day={day} />

      <section>
        <SectionHeader
          title="The day, hour by hour"
          subtitle="Stops in order, with the drive between each."
        />
        <DayTimeline day={day} />
      </section>

      {dayPhotos.length > 0 ? (
        <section>
          <SectionHeader
            title="Photo strip"
            subtitle="Themed placeholders until the group's own shots are uploaded."
          />
          <DayPhotoStrip photos={dayPhotos} />
        </section>
      ) : null}

      {day.notes.length > 0 ? (
        <section>
          <SectionHeader title="Good to know" subtitle="Lodging, fees and winter safety." />
          <DayInfoCards day={day} />
        </section>
      ) : null}

      <section>
        <SectionHeader
          title="Stops"
          subtitle="The places and activities for this day. Unlock editing to add your own."
        />
        <StopsLibrary seedDay={day} />
      </section>

      {day.experiences ? (
        <section>
          <SectionHeader
            title="Make it memorable"
            subtitle="Scenic viewpoints, local gems and food culture — suggestions, not fixed plans."
          />
          <DayExperiences data={day.experiences} />
        </section>
      ) : null}
    </div>
  );
}
