import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { RouteLeg } from "@/lib/types";

/** Driving legs for a day, with mileage, drive-time and departure target. */
export function LegList({ legs }: { legs: RouteLeg[] }) {
  if (legs.length === 0) {
    return (
      <Card className="text-sm text-muted">
        No intercity driving — a full day in the city.
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {legs.map((leg) => (
        <Card key={leg.id} className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-semibold text-ink-900">
                {leg.from} → {leg.to}
              </span>
              <span className="text-sm text-muted">
                {leg.miles} mi · {leg.driveTime}
              </span>
            </div>
            {leg.departTime ? (
              <Badge tone="ember">Depart {leg.departTime}</Badge>
            ) : null}
          </div>
          {leg.notes ? (
            <p className="text-sm text-muted">{leg.notes}</p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
