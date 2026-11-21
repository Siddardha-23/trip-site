"use client";

import { useCallback, useEffect, useState } from "react";
import { get, subscribe, upsert } from "@/lib/data/repository";
import { useEditor } from "@/hooks/use-editor";
import { Card } from "@/components/ui/Card";
import { EditableField } from "@/components/ui/EditableField";
import type { RentalAgreement } from "@/lib/types";

/**
 * Car-rental / one-way drop-off panel. Manual fields (company, pickup/drop
 * locations + dates, base rate, one-way drop fee, notes) are inline-editable
 * when the editor is unlocked, persisted via the repository (mock store in
 * preview). Reads the seeded rental and stays in sync via subscribe.
 */
export function RentalPanel({ seed }: { seed: RentalAgreement }) {
  const { canEdit } = useEditor();
  const [rental, setRental] = useState<RentalAgreement>(seed);

  const refresh = useCallback(() => {
    void get("rentals", seed.id).then((next) => {
      if (next) setRental(next);
    });
  }, [seed.id]);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribe("rentals", refresh);
    return unsubscribe;
  }, [refresh]);

  const save = useCallback(
    async (patch: Partial<RentalAgreement>) => {
      const next = { ...rental, ...patch };
      await upsert("rentals", next);
      setRental(next);
    },
    [rental],
  );

  const saveMoney = useCallback(
    (key: "baseRate" | "oneWayDropFee") => (raw: string) => {
      const cleaned = raw.replace(/[^0-9.]/g, "");
      const value = cleaned === "" ? null : Number(cleaned);
      return save({ [key]: Number.isNaN(value as number) ? null : value });
    },
    [save],
  );

  function money(value: number | null): string {
    return value === null ? "" : `$${value.toLocaleString()}`;
  }

  return (
    <Card className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <Field label="Rental company">
          <EditableField
            value={rental.company}
            canEdit={canEdit}
            placeholder="Not chosen yet"
            onSave={(v) => save({ company: v })}
          />
        </Field>
        <Field label="One-way drop fee">
          <EditableField
            value={money(rental.oneWayDropFee)}
            canEdit={canEdit}
            placeholder="Not priced yet"
            onSave={saveMoney("oneWayDropFee")}
          />
        </Field>
        <Field label="Pickup location">
          <EditableField
            value={rental.pickupLocation}
            canEdit={canEdit}
            placeholder="Add a pickup point"
            onSave={(v) => save({ pickupLocation: v })}
          />
        </Field>
        <Field label="Drop-off location">
          <EditableField
            value={rental.dropoffLocation}
            canEdit={canEdit}
            placeholder="Add a drop-off point"
            onSave={(v) => save({ dropoffLocation: v })}
          />
        </Field>
        <Field label="Pickup date">
          <EditableField
            value={rental.pickupDate}
            canEdit={canEdit}
            placeholder="YYYY-MM-DD"
            onSave={(v) => save({ pickupDate: v })}
          />
        </Field>
        <Field label="Drop-off date">
          <EditableField
            value={rental.dropoffDate}
            canEdit={canEdit}
            placeholder="YYYY-MM-DD"
            onSave={(v) => save({ dropoffDate: v })}
          />
        </Field>
        <Field label="Base rate">
          <EditableField
            value={money(rental.baseRate)}
            canEdit={canEdit}
            placeholder="Not priced yet"
            onSave={saveMoney("baseRate")}
          />
        </Field>
      </div>

      <Field label="Notes">
        <EditableField
          value={rental.notes ?? ""}
          canEdit={canEdit}
          multiline
          placeholder="Add rental terms, confirmation numbers, etc."
          onSave={(v) => save({ notes: v })}
          displayClassName="block text-sm text-muted"
        />
      </Field>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
      <div className="text-ink-900">{children}</div>
    </div>
  );
}
