"use client";

import { useMemo } from "react";
import { useEntityList } from "@/hooks/use-entity-list";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Person } from "@/lib/types";

/**
 * Driver-rotation tracker. Lists the travelers marked as able to drive (set in
 * the Group section) and surfaces the document's warning to rotate only between
 * listed, rested drivers on the long December 28 driving day.
 */
export function DriverRotationPanel({ seedPeople }: { seedPeople: Person[] }) {
  const { items: people } = useEntityList("people", seedPeople);
  const drivers = useMemo(() => people.filter((p) => p.canDrive), [people]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-ember-400/60 bg-ember-500/10">
        <p className="text-sm font-medium text-clay-700">
          Rotate only between listed, rested drivers.
        </p>
        <p className="mt-1 text-sm text-muted">
          December 28 (South Rim → San Diego) is the longest leg: 504 miles, about
          8.5-10 hr. Keep the 5:30am start and avoid Route 66 or Joshua Tree
          detours. If nobody wants a drive this long, it is the first leg to
          replace with a flight or split with an extra night.
        </p>
      </Card>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Listed drivers
        </h3>
        {drivers.length === 0 ? (
          <EmptyState
            title="No drivers listed yet"
            description="Mark travelers as drivers in the Group section to build the rotation."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {drivers.map((person) => (
              <li key={person.id}>
                <Card className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: person.avatarColor ?? "#64748b" }}
                      aria-hidden
                    >
                      {person.name.trim().charAt(0).toUpperCase() || "?"}
                    </span>
                    <span className="font-medium text-ink-900">{person.name}</span>
                  </div>
                  <Badge tone="success">Can drive</Badge>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
