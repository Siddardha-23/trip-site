"use client";

import { useEffect, useState } from "react";

interface TripProgressProps {
  startDate: string;
  endDate: string;
  nights: number;
}

/**
 * A thin progress indicator for the trip window. Before the trip it shows 0%,
 * during the trip it fills proportionally by elapsed time, after it shows 100%.
 */
export function TripProgress({ startDate, endDate, nights }: TripProgressProps) {
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T23:59:59`).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const immediate = setTimeout(tick, 0);
    const id = setInterval(tick, 60_000);
    return () => {
      clearTimeout(immediate);
      clearInterval(id);
    };
  }, []);

  const pct =
    now === null
      ? 0
      : Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));

  const label =
    now === null
      ? "Not started"
      : now < start
        ? "Not started"
        : now > end
          ? "Complete"
          : `Night ${Math.min(nights, Math.max(1, Math.ceil((pct / 100) * nights)))} of ${nights}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-muted">
        <span>Trip progress</span>
        <span>{label}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-sand-100">
        <div
          className="h-full rounded-full bg-ember-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
