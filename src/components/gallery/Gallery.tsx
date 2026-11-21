"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useEntityList } from "@/hooks/use-entity-list";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PhotoTile } from "@/components/gallery/PhotoTile";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";
import { PhotoUploader } from "@/components/gallery/PhotoUploader";
import type { Day, Photo } from "@/lib/types";

interface DayGroup {
  key: string;
  title: string;
  photos: Photo[];
}

/**
 * Per-day photo gallery with a lightbox. Reads photos through the repository
 * (seeded sample photos in mock mode, live Storage-backed records when
 * Supabase is configured) and groups them by day for clear segregation.
 */
export function Gallery({ days, seed }: { days: Day[]; seed: Photo[] }) {
  const { items } = useEntityList("photos", seed);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Flat, stable order drives the lightbox; groups drive the layout.
  const ordered = useMemo(() => {
    const dayOrder = new Map(days.map((d, i) => [d.id, i]));
    return [...items].sort((a, b) => {
      const ai = a.dayId ? dayOrder.get(a.dayId) ?? 99 : 99;
      const bi = b.dayId ? dayOrder.get(b.dayId) ?? 99 : 99;
      if (ai !== bi) return ai - bi;
      return a.id.localeCompare(b.id);
    });
  }, [items, days]);

  const groups = useMemo<DayGroup[]>(() => {
    const byDay = new Map<string, Photo[]>();
    for (const photo of ordered) {
      const key = photo.dayId ?? "unsorted";
      const list = byDay.get(key) ?? [];
      list.push(photo);
      byDay.set(key, list);
    }
    const result: DayGroup[] = [];
    for (const day of days) {
      const dayPhotos = byDay.get(day.id);
      if (dayPhotos && dayPhotos.length) {
        result.push({
          key: day.id,
          title: `Day ${day.dayNumber} · ${day.title}`,
          photos: dayPhotos,
        });
      }
    }
    const unsorted = byDay.get("unsorted");
    if (unsorted && unsorted.length) {
      result.push({ key: "unsorted", title: "More photos", photos: unsorted });
    }
    return result;
  }, [ordered, days]);

  const indexOf = (photo: Photo) => ordered.findIndex((p) => p.id === photo.id);

  return (
    <div className="flex flex-col gap-6">
      <PhotoUploader days={days} />

      <Card className="flex flex-col gap-2 bg-gradient-to-br from-sand-100 to-surface sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-800">
          Every photo lands under its day. When the trip is done, the public
          recap stitches the best of them into one shareable page.
        </p>
        <Link
          href="/moments"
          className="shrink-0 text-sm font-medium text-clay-700 hover:underline"
        >
          View the public recap →
        </Link>
      </Card>

      {groups.length === 0 ? (
        <EmptyState
          title="No photos yet"
          description="Photos added to the trip appear here, grouped by day."
        />
      ) : (
        groups.map((group) => (
          <section key={group.key} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-ink-900">
              {group.title}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {group.photos.map((photo) => (
                <PhotoTile
                  key={photo.id}
                  photo={photo}
                  onOpen={() => setOpenIndex(indexOf(photo))}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {openIndex !== null ? (
        <PhotoLightbox
          photos={ordered}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      ) : null}
    </div>
  );
}
