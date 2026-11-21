import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { trip } from "@/lib/seed/trip-seed";

/** Plan-at-a-glance summary stats, transcribed from the itinerary. */
export function TripSummary() {
  return (
    <Card>
      <dl className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        <Stat label="Nights" value={trip.nights} hint="4 overnight bases" />
        <Stat label="Travelers" value={`${trip.travelerCount} adults`} hint={trip.roomSetup} />
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
        <Stat label="Bases" value="4" hint={trip.overnightSummary} />
        <Stat label="Pace" value="Fast" hint={trip.pace} />
      </dl>
    </Card>
  );
}
