import {
  budgetItems,
  openDecisions,
  people,
  places,
  trip,
  weatherCards,
} from "@/lib/seed/trip-seed";

// Placeholder foundation page. It exercises the typed seed data in the build so
// that types.ts and trip-seed.ts are verified by `npm run build` / `tsc`.
// The full segmented UI (Dashboard, Itinerary, Map, Group, Money, Logistics,
// Moments) is built in later features.
export default function Home() {
  const pricedCount = budgetItems.filter((item) => item.priced).length;

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">{trip.title}</h1>
        <p className="text-zinc-500">{trip.subtitle}</p>
      </header>

      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-zinc-500">Nights</dt>
          <dd className="font-medium">{trip.nights}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Travelers</dt>
          <dd className="font-medium">{people.length} adults</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Intercity distance</dt>
          <dd className="font-medium">
            About {trip.totalIntercityMiles.toLocaleString()} mi
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Driving time</dt>
          <dd className="font-medium">About {trip.totalDrivingHours} hr</dd>
        </div>
      </dl>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Route ledger</h2>
        <ol className="flex flex-col gap-2">
          {trip.days.map((day) => (
            <li key={day.id} className="rounded-lg border border-zinc-200 p-3">
              <p className="font-medium">
                Day {day.dayNumber} · {day.weekday}, {day.date}
              </p>
              <p className="text-sm text-zinc-600">{day.title}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-sm text-zinc-500">
        {places.length} places · {pricedCount} of {budgetItems.length} budget
        items priced · {weatherCards.length} seasonal checks ·{" "}
        {openDecisions.length} open decisions
      </p>
    </main>
  );
}
