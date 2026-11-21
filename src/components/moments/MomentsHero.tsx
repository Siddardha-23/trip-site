import type { Trip } from "@/lib/types";

/** Warm full-bleed hero that opens the public recap. */
export function MomentsHero({ trip }: { trip: Trip }) {
  return (
    <header className="bg-celebrate relative overflow-hidden px-6 py-20 text-center text-white sm:py-28">
      {/* Pure-CSS warmth — soft glows evoke sunset light, no remote assets. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-glow-300/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-rose-400/40 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
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
