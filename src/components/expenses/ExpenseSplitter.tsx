"use client";

import { useCallback, useMemo, useState } from "react";
import { remove, upsert } from "@/lib/data/repository";
import { useEditor } from "@/hooks/use-editor";
import { useEntityList } from "@/hooks/use-entity-list";
import { computeBalances, settleUp } from "@/lib/money/split";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddExpenseForm } from "@/components/expenses/AddExpenseForm";
import type { Expense, Person } from "@/lib/types";

function money(value: number): string {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Shared expense splitter. Lists expenses (payer, participants, amount), shows
 * each person's running balance and a settle-up suggestion. Editors can add and
 * remove expenses. Balance/settle-up math lives in src/lib/money/split.ts.
 */
export function ExpenseSplitter({
  seedExpenses,
  seedPeople,
}: {
  seedExpenses: Expense[];
  seedPeople: Person[];
}) {
  const { canEdit } = useEditor();
  const { items: expenses } = useEntityList("expenses", seedExpenses);
  const { items: people } = useEntityList("people", seedPeople);
  const [adding, setAdding] = useState(false);

  const nameOf = useCallback(
    (id: string) => people.find((p) => p.id === id)?.name ?? "Unknown",
    [people],
  );

  const balances = useMemo(
    () => computeBalances(expenses, people.map((p) => p.id)),
    [expenses, people],
  );
  const transfers = useMemo(() => settleUp(balances), [balances]);

  const addExpense = useCallback(async (expense: Expense) => {
    await upsert("expenses", expense);
    setAdding(false);
  }, []);

  const removeExpense = useCallback(async (id: string) => {
    await remove("expenses", id);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Running balances
        </h3>
        <Card className="flex flex-col gap-2">
          {balances.map((b) => (
            <div
              key={b.personId}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="font-medium text-ink-900">
                {nameOf(b.personId)}
              </span>
              <span
                className={
                  b.net > 0.005
                    ? "font-semibold text-emerald-700"
                    : b.net < -0.005
                      ? "font-semibold text-clay-700"
                      : "text-muted"
                }
              >
                {b.net > 0.005
                  ? `is owed ${money(b.net)}`
                  : b.net < -0.005
                    ? `owes ${money(-b.net)}`
                    : "settled"}
              </span>
            </div>
          ))}
        </Card>
      </section>

      {transfers.length > 0 ? (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            Settle up
          </h3>
          <Card className="flex flex-col gap-2">
            {transfers.map((t, i) => (
              <p key={`${t.fromId}-${t.toId}-${i}`} className="text-sm text-ink-900">
                <span className="font-medium">{nameOf(t.fromId)}</span> pays{" "}
                <span className="font-medium">{nameOf(t.toId)}</span>{" "}
                <span className="font-semibold text-ember-600">
                  {money(t.amount)}
                </span>
              </p>
            ))}
          </Card>
        </section>
      ) : null}

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Expenses
        </h3>
        {expenses.length === 0 ? (
          <EmptyState
            title="No expenses yet"
            description="Unlock editing to log who paid for what and split it across the group."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {expenses.map((expense) => (
              <li key={expense.id}>
                <Card className="flex items-start justify-between gap-3 p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-ink-900">
                        {expense.description}
                      </span>
                      <Badge tone="neutral">{expense.category}</Badge>
                    </div>
                    <p className="text-sm text-muted">
                      {money(expense.amount)} paid by {nameOf(expense.payerId)},
                      split {expense.participantIds.length} way
                      {expense.participantIds.length === 1 ? "" : "s"}
                      {expense.participantIds.length > 0
                        ? ` (${expense.participantIds.map(nameOf).join(", ")})`
                        : ""}
                    </p>
                  </div>
                  {canEdit ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void removeExpense(expense.id)}
                      aria-label={`Remove ${expense.description}`}
                      className="text-clay-700"
                    >
                      Remove
                    </Button>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canEdit ? (
        adding ? (
          <Card>
            <AddExpenseForm
              people={people}
              onAdd={addExpense}
              onCancel={() => setAdding(false)}
            />
          </Card>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdding(true)}
            disabled={people.length === 0}
          >
            + Add an expense
          </Button>
        )
      ) : null}
    </div>
  );
}
