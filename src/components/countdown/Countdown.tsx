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
      <div className="h-16 animate-pulse rounded-xl bg-sand-100" aria-hidden />
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
    <div className="flex gap-3">
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className="countdown-tile flex min-w-14 flex-col items-center rounded-xl border border-ember-400/30 bg-gradient-to-b from-glow-300/60 to-sand-100 px-3 py-2"
        >
          <span className="text-2xl font-semibold tabular-nums text-clay-700">
            {String(r[key]).padStart(2, "0")}
          </span>
          <span className="text-xs uppercase tracking-wide text-muted">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
