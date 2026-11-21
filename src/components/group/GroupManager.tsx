"use client";

import { useCallback, useMemo, useState } from "react";
import { remove, upsert } from "@/lib/data/repository";
import { useEditor } from "@/hooks/use-editor";
import { useEntityList } from "@/hooks/use-entity-list";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Stat } from "@/components/ui/Stat";
import { EmptyState } from "@/components/ui/EmptyState";
import { PersonRow } from "@/components/group/PersonRow";
import { AddPersonForm } from "@/components/group/AddPersonForm";
import type { Person } from "@/lib/types";

/** Hard cap from the brief: the roster supports 5 to 15 travelers. */
export const MAX_TRAVELERS = 15;

const PALETTE = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
  "#06b6d4",
  "#f43f5e",
  "#8b5cf6",
  "#10b981",
  "#d946ef",
];

/**
 * People / headcount manager. Lists the seeded travelers, lets an unlocked
 * editor add (up to 15) and remove people and set each person's RSVP. Reads and
 * stays in sync through the repository (Supabase realtime, or mock store).
 */
export function GroupManager({ seed }: { seed: Person[] }) {
  const { canEdit } = useEditor();
  const { items: people } = useEntityList("people", seed);
  const [adding, setAdding] = useState(false);

  const headcount = useMemo(() => {
    const going = people.filter((p) => p.rsvp === "yes").length;
    const maybe = people.filter((p) => p.rsvp === "maybe").length;
    const no = people.filter((p) => p.rsvp === "no").length;
    const pending = people.filter((p) => p.rsvp === "pending").length;
    return { total: people.length, going, maybe, no, pending };
  }, [people]);

  const atCap = people.length >= MAX_TRAVELERS;

  const addPerson = useCallback(
    async (name: string) => {
      if (people.length >= MAX_TRAVELERS) return;
      const used = new Set(people.map((p) => p.avatarColor));
      const color = PALETTE.find((c) => !used.has(c)) ?? PALETTE[0];
      const person: Person = {
        id: `person-${Date.now()}`,
        name,
        isAdult: true,
        rsvp: "pending",
        canDrive: false,
        avatarColor: color,
      };
      await upsert("people", person);
      setAdding(false);
    },
    [people],
  );

  const updatePerson = useCallback(async (next: Person) => {
    await upsert("people", next);
  }, []);

  const removePerson = useCallback(async (id: string) => {
    await remove("people", id);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Stat label="Travelers" value={headcount.total} hint="of 15 max" />
          <Stat label="Going" value={headcount.going} />
          <Stat label="Maybe" value={headcount.maybe} />
          <Stat label="Not coming" value={headcount.no} />
          <Stat label="No reply" value={headcount.pending} />
        </dl>
      </Card>

      {people.length === 0 ? (
        <EmptyState
          title="No travelers yet"
          description="Unlock editing to add everyone coming on the trip."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {people.map((person) => (
            <li key={person.id}>
              <PersonRow
                person={person}
                canEdit={canEdit}
                onChange={updatePerson}
                onRemove={() => void removePerson(person.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {canEdit ? (
        adding ? (
          <Card>
            <AddPersonForm
              onAdd={addPerson}
              onCancel={() => setAdding(false)}
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdding(true)}
              disabled={atCap}
            >
              + Add a traveler
            </Button>
            {atCap ? (
              <p className="text-xs text-muted">
                Maximum of {MAX_TRAVELERS} travelers reached.
              </p>
            ) : null}
          </div>
        )
      ) : null}
    </div>
  );
}
