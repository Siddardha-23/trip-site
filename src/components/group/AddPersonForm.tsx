"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface AddPersonFormProps {
  onAdd: (name: string) => void | Promise<void>;
  onCancel: () => void;
}

/** Minimal form to add a traveler to the roster (editor mode only). */
export function AddPersonForm({ onAdd, onCancel }: AddPersonFormProps) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await onAdd(name.trim());
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "flex-1 rounded-lg border border-[color:var(--border)] bg-surface px-3 py-2 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-ember-400/40";

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Traveler name"
        className={inputClass}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={busy || !name.trim()}>
          {busy ? "Adding…" : "Add"}
        </Button>
      </div>
    </form>
  );
}
