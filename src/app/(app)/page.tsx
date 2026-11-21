import { Card } from "@/components/ui/Card";
import { TripSummary } from "@/components/dashboard/TripSummary";
import { RouteLedger } from "@/components/dashboard/RouteLedger";
import { Countdown } from "@/components/countdown/Countdown";
import { TripProgress } from "@/components/countdown/TripProgress";
import { trip } from "@/lib/seed/trip-seed";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
            {trip.title}
          </h1>
          <p className="text-muted">{trip.subtitle}</p>
        </div>
        <Card className="flex flex-col gap-4 bg-gradient-to-br from-sand-100 to-surface">
          <p className="text-sm text-ink-800">
            Four friends, one road, and five nights from the red rocks of Arizona
            to the fog of San Francisco. Here is the whole plan in one place —
            no scrolling through a group chat to find it.
          </p>
          <Countdown startDate={trip.startDate} endDate={trip.endDate} />
          <TripProgress
            startDate={trip.startDate}
            endDate={trip.endDate}
            nights={trip.nights}
          />
        </Card>
      </section>

      <TripSummary />

      <RouteLedger />
    </div>
  );
}
