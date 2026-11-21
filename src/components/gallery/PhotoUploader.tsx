"use client";

import { useCallback, useRef, useState } from "react";
import { createClient, supabaseAvailable } from "@/lib/supabase/client";
import { upsert } from "@/lib/data/repository";
import { useEditor } from "@/hooks/use-editor";
import { compressImage } from "@/lib/images/compress";
import { PHOTOS_BUCKET } from "@/lib/images/storage";
import { Button } from "@/components/ui/Button";
import type { Day } from "@/lib/types";

/**
 * Editor-gated photo upload. Every file is compressed in the browser
 * (compressImage) BEFORE it is sent to the Supabase Storage 'photos' bucket,
 * to protect the free tier. Without Supabase (mock mode) the control is
 * disabled and explains why, so the gallery still renders everywhere.
 */
export function PhotoUploader({ days }: { days: Day[] }) {
  const { canEdit } = useEditor();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dayId, setDayId] = useState<string>(days[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const storageReady = supabaseAvailable;
  const canUpload = canEdit && storageReady;

  const handleFile = useCallback(
    async (file: File) => {
      const client = createClient();
      if (!client) return;
      setBusy(true);
      setError(null);
      setSaved(null);
      try {
        // Compress BEFORE upload to stay inside the free Storage/egress budget.
        const { file: compressed, originalBytes, compressedBytes } =
          await compressImage(file);
        const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^\w.\-]/g, "_");
        const path = `${dayId || "unsorted"}/${Date.now()}-${safeName}.webp`;
        const { error: uploadError } = await client.storage
          .from(PHOTOS_BUCKET)
          .upload(path, compressed, {
            upsert: false,
            contentType: compressed.type || "image/webp",
          });
        if (uploadError) throw uploadError;
        await upsert("photos", {
          id: `photo-${Date.now()}`,
          url: path,
          caption: file.name,
          takenAt: new Date().toISOString(),
          dayId: dayId || undefined,
        });
        const savedKb = Math.max(
          0,
          Math.round((originalBytes - compressedBytes) / 1024),
        );
        setSaved(`Uploaded. Compression saved about ${savedKb} KB.`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setBusy(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [dayId],
  );

  if (!canEdit) return null;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-[color:var(--border)] bg-sand-50 p-4">
      {!storageReady ? (
        <p className="text-sm text-muted">
          Photo uploads need a configured Supabase Storage &quot;photos&quot;
          bucket. In preview mode the gallery shows sample photos and uploading
          is disabled.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-ink-800" htmlFor="photo-day">
          Add to day
        </label>
        <select
          id="photo-day"
          value={dayId}
          onChange={(e) => setDayId(e.target.value)}
          disabled={!canUpload || busy}
          className="rounded-lg border border-[color:var(--border)] bg-surface px-2 py-1.5 text-sm text-ink-900"
        >
          {days.map((day) => (
            <option key={day.id} value={day.id}>
              Day {day.dayNumber} · {day.title}
            </option>
          ))}
        </select>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={!canUpload || busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={!canUpload || busy}
          onClick={() => fileInputRef.current?.click()}
        >
          {busy ? "Compressing & uploading…" : "+ Add a photo"}
        </Button>
      </div>

      {saved ? <p className="text-xs text-emerald-700">{saved}</p> : null}
      {error ? <p className="text-xs text-clay-700">{error}</p> : null}
    </div>
  );
}
