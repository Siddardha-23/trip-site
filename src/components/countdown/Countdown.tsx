"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  /** ISO date (YYYY-MM-DD) of the trip start. */
  startDate: string;
  /** ISO date of the final day, to compute "in progress" vs "done". */
  endDate: string;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diff(target: number, now: number): Remaining {
  const total = Math.max(0, target - now);
  const seconds = Math.floor(total / 1000) % 60;
  const minutes = Math.floor(total / (1000 * 60)) % 60;
  const hours = Math.floor(total / (1000 * 60 * 60)) % 24;
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds };
}

const UNITS: { key: keyof Remaining; label: string }[] = [
  { key: "days", label: "days" },
  { key: "hours", label: "hrs" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "sec" },
];

/**
 * A short hype line that changes as the start date nears, so the countdown
 * feels alive and escalates toward departure. Driven purely by the whole-day
 * count so it is stable second-to-second.
 */
function hypeLine(r: Remaining): string {
  if (r.days >= 14) return "The road trip is on the horizon. Start dreaming. 🌅";
  if (r.days >= 7) return "Under two weeks — time to build the playlist. 🎶";
  if (r.days >= 2) return `Just ${r.days} days to go. Pack the snacks! 🧳`;
  if (r.days === 1) return "One sleep away. Charge everything tonight. ⚡";
  if (r.hours >= 1) return "Hours out now — the engine is practically warm. 🚗";
  return "Minutes to go. This is really happening! 🎉";
}

/**
 * Live countdown to the trip start. Ticks every second on the client. Before
 * mount (SSR) it renders a neutral placeholder to avoid hydration mismatch.
 */
export function Countdown({ startDate, endDate }: CountdownProps) {
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T23:59:59`).getTime();

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const immediate = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(immediate);
      clearInterval(id);
    };
  }, []);

  if (now === null) {
    return (
      <div
        className="h-28 animate-pulse rounded-2xl bg-sand-100"
        aria-hidden
      />
    );
  }

  if (now >= end) {
    return (
      <p className="text-lg font-medium text-clay-700">
        The trip has wrapped. Time to relive it in Moments. 💛
      </p>
    );
  }

  if (now >= start) {
    return (
      <p className="text-lg font-medium text-clay-700">
        The adventure is happening right now. Drive safe out there. 🚗
      </p>
    );
  }

  const r = diff(start, now);

  return (
    <div className="countdown-stage flex flex-col gap-3">
      <p
        className="countdown-hype text-sm font-medium text-clay-700"
        aria-live="polite"
      >
        {hypeLine(r)}
      </p>
      <div
        className="flex gap-2 sm:gap-3"
        role="timer"
        aria-label={`${r.days} days, ${r.hours} hours, ${r.minutes} minutes and ${r.seconds} seconds until the trip starts`}
      >
        {UNITS.map(({ key, label }) => (
          <div
            key={key}
            className={`countdown-tile relative flex flex-1 flex-col items-center overflow-hidden rounded-2xl border border-ember-400/40 bg-gradient-to-b from-glow-300/70 to-sand-100 px-2 py-3 shadow-sm sm:px-4 sm:py-4 ${
              key === "seconds" ? "countdown-tile--seconds" : ""
            }`}
          >
            {key === "seconds" ? (
              <span
                key={r.seconds}
                aria-hidden
                className="countdown-value countdown-value--tick text-3xl font-bold tabular-nums text-clay-700 sm:text-4xl"
              >
                {String(r.seconds).padStart(2, "0")}
              </span>
            ) : (
              <span
                aria-hidden
                className="countdown-value text-3xl font-bold tabular-nums text-clay-700 sm:text-4xl"
              >
                {String(r[key]).padStart(2, "0")}
              </span>
            )}
            <span className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-muted sm:text-xs">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
