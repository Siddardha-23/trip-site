import { Card } from "@/components/ui/Card";
import { TripSummary } from "@/components/dashboard/TripSummary";
import { RouteArc } from "@/components/dashboard/RouteArc";
import { RouteLedger } from "@/components/dashboard/RouteLedger";
import { Countdown } from "@/components/countdown/Countdown";
import { TripProgress } from "@/components/countdown/TripProgress";
import { trip } from "@/lib/seed/trip-seed";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="bg-celebrate relative overflow-hidden rounded-3xl px-6 py-10 text-white shadow-sm sm:px-10 sm:py-14">
          {/* Soft radial warmth, pure CSS — zero-cost emotional imagery. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-glow-300/40 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-rose-400/40 blur-3xl"
          />
          <div className="relative flex flex-col gap-2">
            <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide">
              Our road trip
            </span>
            <h1 className="text-3xl font-semibold tracking-tight drop-shadow-sm sm:text-4xl">
              {trip.title}
            </h1>
            <p className="text-white/90">{trip.subtitle}</p>
          </div>
        </div>
        <Card className="flex flex-col gap-4 bg-gradient-to-br from-sand-100 to-surface">
          <p className="text-sm text-ink-800">
            Up to six friends, one road, and six nights from the red rocks of
            Arizona down to the Pacific and up the Big Sur coast to San
            Francisco. Here is the whole plan in one place, no scrolling through
            a group chat to find it.
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

      <RouteArc />

      <RouteLedger />
    </div>
  );
}
