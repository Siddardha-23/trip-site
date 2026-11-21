"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Stop, StopKind } from "@/lib/types";

const KINDS: { value: StopKind; label: string }[] = [
  { value: "sightseeing", label: "Sightseeing" },
  { value: "meal", label: "Meal" },
  { value: "activity", label: "Activity" },
  { value: "checkin", label: "Check-in" },
  { value: "departure", label: "Departure" },
  { value: "flex", label: "Flexible" },
];

interface AddStopFormProps {
  dayId: string;
  onAdd: (stop: Stop) => void | Promise<void>;
  onCancel: () => void;
}

/** Minimal form to add a new stop to a day (editor mode only). */
export function AddStopForm({ dayId, onAdd, onCancel }: AddStopFormProps) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<StopKind>("sightseeing");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const stop: Stop = {
      id: `stop-${dayId}-${Date.now()}`,
      name: name.trim(),
      kind,
      time: time.trim() || undefined,
      description: description.trim() || undefined,
    };
    try {
      await onAdd(stop);
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "rounded-lg border border-[color:var(--border)] bg-surface px-3 py-2 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-ember-400/40";

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Stop name (required)"
          className={inputClass}
        />
        <input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time, e.g. 9:00am"
          className={inputClass}
        />
      </div>
      <select
        value={kind}
        onChange={(e) => setKind(e.target.value as StopKind)}
        className={inputClass}
      >
        {KINDS.map((k) => (
          <option key={k.value} value={k.value}>
            {k.label}
          </option>
        ))}
      </select>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Notes (optional)"
        rows={2}
        className={inputClass}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={busy || !name.trim()}>
          {busy ? "Adding…" : "Add stop"}
        </Button>
      </div>
    </form>
  );
}
