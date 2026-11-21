"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Expense, Person } from "@/lib/types";

interface AddExpenseFormProps {
  people: Person[];
  onAdd: (expense: Expense) => void | Promise<void>;
  onCancel: () => void;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Form to log a shared expense: description, amount, who paid, and which people
 * share it (defaults to everyone). Editor mode only.
 */
export function AddExpenseForm({ people, onAdd, onCancel }: AddExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [payerId, setPayerId] = useState(people[0]?.id ?? "");
  const [participantIds, setParticipantIds] = useState<string[]>(
    people.map((p) => p.id),
  );
  const [busy, setBusy] = useState(false);

  function toggleParticipant(id: string) {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  const numericAmount = Number(amount.replace(/[^0-9.]/g, ""));
  const valid =
    description.trim().length > 0 &&
    numericAmount > 0 &&
    !Number.isNaN(numericAmount) &&
    payerId !== "" &&
    participantIds.length > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    const expense: Expense = {
      id: `expense-${Date.now()}`,
      description: description.trim(),
      amount: numericAmount,
      currency: "USD",
      date: todayISO(),
      payerId,
      participantIds,
      category: category.trim() || "general",
    };
    try {
      await onAdd(expense);
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was it for? (required)"
          className={inputClass}
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="Amount, e.g. 100"
          className={inputClass}
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (optional)"
          className={inputClass}
        />
        <select
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Who paid?
          </option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs uppercase tracking-wide text-muted">
          Split between
        </legend>
        <div className="flex flex-wrap gap-2">
          {people.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] px-2.5 py-1 text-sm text-ink-900"
            >
              <input
                type="checkbox"
                checked={participantIds.includes(p.id)}
                onChange={() => toggleParticipant(p.id)}
              />
              {p.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={busy || !valid}>
          {busy ? "Adding…" : "Add expense"}
        </Button>
      </div>
    </form>
  );
}
