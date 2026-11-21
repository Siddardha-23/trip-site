"use client";

import { useCallback, useRef, useState } from "react";
import { createClient, supabaseAvailable } from "@/lib/supabase/client";
import { remove, upsert } from "@/lib/data/repository";
import { useEditor } from "@/hooks/use-editor";
import { useEntityList } from "@/hooks/use-entity-list";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { VaultDocument } from "@/lib/types";

const BUCKET = "documents";

/**
 * Shared document vault for hotel/booking confirmations. When Supabase Storage
 * is configured, an unlocked editor can upload a file to the private
 * `documents` bucket and the stored path is kept on a VaultDocument record.
 * Without Storage (mock mode) the vault degrades to a read-only list with
 * upload disabled, so the segment still renders everywhere.
 */
export function DocumentVault({ seed }: { seed: VaultDocument[] }) {
  const { canEdit } = useEditor();
  const { items } = useEntityList("vaultDocuments", seed);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageReady = supabaseAvailable;
  const canUpload = canEdit && storageReady;

  const handleFile = useCallback(
    async (file: File) => {
      const client = createClient();
      if (!client) return;
      setBusy(true);
      setError(null);
      try {
        const path = `${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
        const { error: uploadError } = await client.storage
          .from(BUCKET)
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        const doc: VaultDocument = {
          id: `doc-${Date.now()}`,
          title: file.name,
          category: "booking",
          url: path,
          uploadedAt: new Date().toISOString(),
        };
        await upsert("vaultDocuments", doc);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setBusy(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [],
  );

  const removeDoc = useCallback(async (id: string) => {
    await remove("vaultDocuments", id);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {!storageReady ? (
        <p className="text-sm text-muted">
          File uploads need a configured Supabase Storage bucket. In preview mode
          the vault lists confirmations but uploading is disabled.
        </p>
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          title="No documents yet"
          description="Hotel and booking confirmations uploaded here stay with the trip."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((doc) => (
            <li key={doc.id}>
              <Card className="flex items-center justify-between gap-3 p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink-900">{doc.title}</span>
                    <Badge tone="neutral">{doc.category}</Badge>
                  </div>
                  {doc.notes ? (
                    <p className="text-sm text-muted">{doc.notes}</p>
                  ) : null}
                </div>
                {canEdit ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void removeDoc(doc.id)}
                    aria-label={`Remove ${doc.title}`}
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

      {canEdit ? (
        <div className="flex flex-col gap-1">
          <input
            ref={fileInputRef}
            type="file"
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
            {busy ? "Uploading…" : "+ Upload a confirmation"}
          </Button>
          {error ? <p className="text-xs text-clay-700">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
