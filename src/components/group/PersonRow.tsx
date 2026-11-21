"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Person, RsvpStatus } from "@/lib/types";

const RSVP_LABEL: Record<RsvpStatus, string> = {
  yes: "Going",
  maybe: "Maybe",
  no: "Not coming",
  pending: "No reply",
};

const RSVP_ORDER: RsvpStatus[] = ["pending", "yes", "maybe", "no"];

function rsvpTone(rsvp: RsvpStatus): "success" | "ember" | "sand" | "neutral" {
  switch (rsvp) {
    case "yes":
      return "success";
    case "maybe":
      return "ember";
    case "no":
      return "sand";
    default:
      return "neutral";
  }
}

interface PersonRowProps {
  person: Person;
  canEdit: boolean;
  onChange: (next: Person) => void | Promise<void>;
  onRemove: () => void;
}

/**
 * A single traveler row. In editor mode the RSVP badge cycles on click and a
 * "can drive" toggle plus remove control appear. Read-only otherwise.
 */
export function PersonRow({ person, canEdit, onChange, onRemove }: PersonRowProps) {
  function cycleRsvp() {
    const idx = RSVP_ORDER.indexOf(person.rsvp);
    const next = RSVP_ORDER[(idx + 1) % RSVP_ORDER.length];
    void onChange({ ...person, rsvp: next });
  }

  function toggleDrive() {
    void onChange({ ...person, canDrive: !person.canDrive });
  }

  return (
    <Card className="flex items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: person.avatarColor ?? "#64748b" }}
          aria-hidden
        >
          {person.name.trim().charAt(0).toUpperCase() || "?"}
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-ink-900">{person.name}</span>
          {person.canDrive ? (
            <span className="text-xs text-muted">Can drive</span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {canEdit ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDrive}
              aria-pressed={person.canDrive}
            >
              {person.canDrive ? "Driver ✓" : "Driver"}
            </Button>
            <button
              type="button"
              onClick={cycleRsvp}
              title="Click to change RSVP"
              className="cursor-pointer rounded-full"
            >
              <Badge tone={rsvpTone(person.rsvp)}>{RSVP_LABEL[person.rsvp]}</Badge>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              aria-label={`Remove ${person.name}`}
              className="text-clay-700"
            >
              Remove
            </Button>
          </>
        ) : (
          <Badge tone={rsvpTone(person.rsvp)}>{RSVP_LABEL[person.rsvp]}</Badge>
        )}
      </div>
    </Card>
  );
}
