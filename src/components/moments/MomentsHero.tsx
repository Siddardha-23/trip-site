import type { Trip } from "@/lib/types";

/** Warm full-bleed hero that opens the public recap. */
export function MomentsHero({ trip }: { trip: Trip }) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-ember-500 via-ember-400 to-sand-300 px-6 py-20 text-center text-white sm:py-28">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide">
          A shared road trip
        </span>
        <h1 className="text-4xl font-semibold tracking-tight drop-shadow-sm sm:text-5xl">
          {trip.title}
        </h1>
        <p className="text-lg text-white/90">{trip.subtitle}</p>
        <p className="max-w-xl text-sm text-white/85">
          Four friends, one road, and five nights from the red rocks of Arizona
          to the fog of San Francisco.
        </p>
      </div>
    </header>
  );
}
