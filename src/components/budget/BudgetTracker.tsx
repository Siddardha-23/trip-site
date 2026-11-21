"use client";

import { useMemo } from "react";
import { useEntityList } from "@/hooks/use-entity-list";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import type { BudgetItem } from "@/lib/types";

function money(value: number): string {
  return `$${value.toLocaleString()}`;
}

/**
 * Budget tracker mapped to the document's priced/not-priced list. Shows each
 * line item with its category and a priced-vs-not-priced flag, plus the known
 * total. The itinerary has no whole-trip total yet, so unpriced items stay
 * explicitly flagged rather than guessed.
 */
export function BudgetTracker({ seed }: { seed: BudgetItem[] }) {
  const { items } = useEntityList("budgetItems", seed);

  const { knownTotal, pricedCount, unpricedCount } = useMemo(() => {
    const priced = items.filter((i) => i.priced);
    const knownTotal = priced.reduce((sum, i) => sum + (i.amount ?? 0), 0);
    return {
      knownTotal,
      pricedCount: priced.length,
      unpricedCount: items.length - priced.length,
    };
  }, [items]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <dl className="grid grid-cols-3 gap-4">
          <Stat
            label="Known so far"
            value={money(knownTotal)}
            hint="Priced items only"
          />
          <Stat label="Priced" value={pricedCount} />
          <Stat label="Not priced" value={unpricedCount} />
        </dl>
        <p className="mt-3 text-xs text-muted">
          There is no whole-trip total yet; not-priced lines are open costs from
          the planning document.
        </p>
      </Card>

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <Card className="flex items-start justify-between gap-3 p-4">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-ink-900">{item.label}</span>
                  <Badge tone="neutral">{item.category}</Badge>
                  {item.priced ? (
                    <Badge tone="success">Priced</Badge>
                  ) : (
                    <Badge tone="ember">Not priced</Badge>
                  )}
                </div>
                {item.notes ? (
                  <p className="text-sm text-muted">{item.notes}</p>
                ) : null}
              </div>
              <span className="shrink-0 text-right font-semibold text-ink-900">
                {item.priced
                  ? item.amount === 0
                    ? "Free"
                    : money(item.amount ?? 0)
                  : "—"}
              </span>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
