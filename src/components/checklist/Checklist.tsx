"use client";

import { useCallback, useMemo } from "react";
import { upsert } from "@/lib/data/repository";
import { useEntityList } from "@/hooks/use-entity-list";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ChecklistItem } from "@/lib/types";

/**
 * Shared, checkable packing/preparation list. Seeded with the NPS winter-gear
 * items. Anyone can toggle an item (it is a shared trip checklist, not an
 * editor-gated structural edit); toggles persist through the repository and
 * sync in realtime when Supabase is configured.
 */
export function Checklist({ seed }: { seed: ChecklistItem[] }) {
  const { items } = useEntityList("checklistItems", seed);

  const groups = useMemo(() => {
    const byCategory = new Map<string, ChecklistItem[]>();
    for (const item of items) {
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }
    return Array.from(byCategory.entries());
  }, [items]);

  const toggle = useCallback(async (item: ChecklistItem) => {
    await upsert("checklistItems", { ...item, checked: !item.checked });
  }, []);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing to pack yet"
        description="The packing list is empty."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map(([category, list]) => {
        const done = list.filter((i) => i.checked).length;
        return (
          <Card key={category} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
                {category}
              </h3>
              <span className="text-xs text-muted">
                {done}/{list.length} packed
              </span>
            </div>
            <ul className="flex flex-col gap-1">
              {list.map((item) => (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 hover:bg-sand-100">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => void toggle(item)}
                      className="h-4 w-4"
                    />
                    <span
                      className={
                        item.checked
                          ? "text-sm text-muted line-through"
                          : "text-sm text-ink-900"
                      }
                    >
                      {item.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
