"use client";

import { useEntityList } from "@/hooks/use-entity-list";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { WeatherCard } from "@/lib/types";

/**
 * Weather / road-check reminder cards from the seed: the 24-48h Grand Canyon
 * forecast recheck, the long driving-day warning, and the New Year's Eve note.
 * These are informational reminders, not a live forecast feed.
 */
export function WeatherCards({ seed }: { seed: WeatherCard[] }) {
  const { items } = useEntityList("weatherCards", seed);

  if (items.length === 0) {
    return (
      <EmptyState
        title="No reminders yet"
        description="Weather and road-check reminders will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((card) => (
        <Card key={card.id} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-medium text-ink-900">{card.location}</h3>
            <span className="text-xs text-muted">{card.date}</span>
          </div>
          <p className="text-sm text-ink-800">{card.guidance}</p>
          {card.warnings.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {card.warnings.map((warning, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-muted"
                >
                  <span aria-hidden className="text-ember-600">
                    ⚠
                  </span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
