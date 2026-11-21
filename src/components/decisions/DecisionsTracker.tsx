"use client";

import { useCallback } from "react";
import { upsert } from "@/lib/data/repository";
import { useEditor } from "@/hooks/use-editor";
import { useEntityList } from "@/hooks/use-entity-list";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EditableField } from "@/components/ui/EditableField";
import { EmptyState } from "@/components/ui/EmptyState";
import type { OpenDecision } from "@/lib/types";

/**
 * Open-decisions tracker seeded with the three decisions that turn the draft
 * into a bookable plan. Editors can mark a decision resolved and record the
 * resolution; everyone else sees current status.
 */
export function DecisionsTracker({ seed }: { seed: OpenDecision[] }) {
  const { canEdit } = useEditor();
  const { items } = useEntityList("decisions", seed);

  const toggleResolved = useCallback(async (decision: OpenDecision) => {
    await upsert("decisions", { ...decision, resolved: !decision.resolved });
  }, []);

  const saveResolution = useCallback(
    (decision: OpenDecision) => async (resolution: string) => {
      await upsert("decisions", {
        ...decision,
        resolution: resolution.trim() || undefined,
      });
    },
    [],
  );

  if (items.length === 0) {
    return (
      <EmptyState
        title="No open decisions"
        description="Decisions that turn the draft into a bookable plan will appear here."
      />
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {items.map((decision) => (
        <li key={decision.id}>
          <Card className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-ink-900">{decision.question}</p>
              {decision.resolved ? (
                <Badge tone="success">Resolved</Badge>
              ) : (
                <Badge tone="ember">Open</Badge>
              )}
            </div>
            {decision.detail ? (
              <p className="text-sm text-muted">{decision.detail}</p>
            ) : null}

            {decision.resolved || canEdit ? (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted">
                  Resolution
                </span>
                <EditableField
                  value={decision.resolution ?? ""}
                  canEdit={canEdit}
                  multiline
                  placeholder="Record the decision here"
                  onSave={saveResolution(decision)}
                  displayClassName="block text-sm text-ink-800"
                />
              </div>
            ) : null}

            {canEdit ? (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void toggleResolved(decision)}
                >
                  {decision.resolved ? "Reopen" : "Mark resolved"}
                </Button>
              </div>
            ) : null}
          </Card>
        </li>
      ))}
    </ol>
  );
}
