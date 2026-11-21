import type { Day } from "@/lib/types";

/** Day-by-day highlight cards for the recap, read straight from the seed. */
export function MomentsDays({ days }: { days: Day[] }) {
  // The checkout day is a departure note, not a highlight; skip empty days.
  const highlights = days.filter((day) => day.overnight !== null);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10">
      <h2 className="mb-6 text-center text-xl font-semibold tracking-tight text-ink-900">
        Day by day
      </h2>
      <ol className="flex flex-col gap-4">
        {highlights.map((day) => (
          <li
            key={day.id}
            className="rounded-2xl border border-[color:var(--border)] border-l-4 border-l-ember-400 bg-surface p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-ink-900">
                <span className="text-clay-700">Day {day.dayNumber}</span> ·{" "}
                {day.title}
              </h3>
              <span className="text-xs text-muted">
                {day.weekday}, {day.date}
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-800">{day.summary}</p>
            {day.overnight ? (
              <p className="mt-2 text-xs font-medium text-clay-700">
                Night · {day.overnight}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
