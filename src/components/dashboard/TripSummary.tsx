import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { trip } from "@/lib/seed/trip-seed";

/** Plan-at-a-glance summary stats, read straight from the trip seed. */
export function TripSummary() {
  // Count overnight bases from the seed so this never drifts from the plan.
  const baseCount = trip.days.filter((day) => day.overnight).length;

  return (
    <Card>
      <dl className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        <Stat
          label="Nights"
          value={trip.nights}
          hint={`${baseCount} overnight bases`}
        />
        <Stat label="Travelers" value="up to 6" hint={trip.roomSetup} />
        <Stat
          label="Intercity"
          value={`~${trip.totalIntercityMiles.toLocaleString()} mi`}
          hint="plus local driving"
        />
        <Stat
          label="Driving time"
          value={`~${trip.totalDrivingHours} hr`}
          hint="before traffic and stops"
        />
        <Stat label="Bases" value={baseCount} hint={trip.overnightSummary} />
        <Stat label="Pace" value="Fast" hint={trip.pace} />
      </dl>
    </Card>
  );
}
