import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Stop } from "@/lib/types";

const KIND_LABEL: Record<Stop["kind"], string> = {
  meal: "Meal",
  sightseeing: "Sightseeing",
  activity: "Activity",
  checkin: "Check-in",
  departure: "Departure",
  flex: "Flexible",
};

interface StopRowProps {
  stop: Stop;
  canEdit: boolean;
  onRemove: () => void;
}

/** A single stop within a day, with an editor-only remove control. */
export function StopRow({ stop, canEdit, onRemove }: StopRowProps) {
  return (
    <Card className="flex items-start justify-between gap-3 p-4">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          {stop.time ? (
            <span className="text-sm font-semibold text-ember-600">
              {stop.time}
            </span>
          ) : null}
          <span className="font-medium text-ink-900">{stop.name}</span>
          <Badge tone="neutral">{KIND_LABEL[stop.kind]}</Badge>
        </div>
        {stop.description ? (
          <p className="text-sm text-muted">{stop.description}</p>
        ) : null}
      </div>
      {canEdit ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          aria-label={`Remove ${stop.name}`}
          className="text-clay-700"
        >
          Remove
        </Button>
      ) : null}
    </Card>
  );
}
