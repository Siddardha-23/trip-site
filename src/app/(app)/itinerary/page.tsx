import { SectionHeader } from "@/components/ui/SectionHeader";
import { DayCard } from "@/components/itinerary/DayCard";
import { trip } from "@/lib/seed/trip-seed";

export default function ItineraryPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Day by day"
        subtitle={`${trip.days.length} days, ${trip.nights} nights. Tap a day for legs, timings and stops.`}
      />
      <ol className="flex flex-col gap-3">
        {trip.days.map((day) => (
          <li key={day.id}>
            <DayCard day={day} />
          </li>
        ))}
      </ol>
    </div>
  );
}
