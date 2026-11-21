"use client";

import { useCallback, useEffect, useState } from "react";
import { get, subscribe, upsert } from "@/lib/data/repository";
import { useEditor } from "@/hooks/use-editor";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StopRow } from "@/components/places/StopRow";
import { AddStopForm } from "@/components/places/AddStopForm";
import type { Day, Stop } from "@/lib/types";

/**
 * Editable per-day places/stops library. Reads the day through the repository
 * (mock store in preview), lets an unlocked editor add/remove stops. Because a
 * Stop has no day link, add/remove persist by upserting the whole Day record
 * with a mutated `stops` array — this works against the `days` entity in mock
 * mode and keeps the day as the single container for its stops.
 */
export function StopsLibrary({ seedDay }: { seedDay: Day }) {
  const { canEdit } = useEditor();
  const [day, setDay] = useState<Day>(seedDay);
  const [adding, setAdding] = useState(false);

  const refresh = useCallback(() => {
    void get("days", seedDay.id).then((next) => {
      if (next) setDay(next);
    });
  }, [seedDay.id]);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribe("days", refresh);
    return unsubscribe;
  }, [refresh]);

  const addStop = useCallback(
    async (stop: Stop) => {
      const next: Day = { ...day, stops: [...day.stops, stop] };
      await upsert("days", next);
      setDay(next);
      setAdding(false);
    },
    [day],
  );

  const removeStop = useCallback(
    async (stopId: string) => {
      const next: Day = {
        ...day,
        stops: day.stops.filter((s) => s.id !== stopId),
      };
      await upsert("days", next);
      setDay(next);
    },
    [day],
  );

  return (
    <div className="flex flex-col gap-3">
      {day.stops.length === 0 ? (
        <EmptyState
          title="No stops planned yet"
          description="Unlock editing to add the places you want to hit on this day."
        />
      ) : (
        <ol className="flex flex-col gap-2">
          {day.stops.map((stop) => (
            <li key={stop.id}>
              <StopRow
                stop={stop}
                canEdit={canEdit}
                onRemove={() => void removeStop(stop.id)}
              />
            </li>
          ))}
        </ol>
      )}

      {canEdit ? (
        adding ? (
          <Card>
            <AddStopForm
              dayId={day.id}
              onAdd={addStop}
              onCancel={() => setAdding(false)}
            />
          </Card>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            + Add a stop
          </Button>
        )
      ) : null}
    </div>
  );
}
