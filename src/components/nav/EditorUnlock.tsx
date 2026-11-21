"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useEditor } from "@/hooks/use-editor";

/**
 * Editor-unlock control for the header. Shows a lock button that opens a small
 * password dialog; on success the UI switches to editable mode. In mock mode
 * (no EDITOR_PASSWORD) unlock fails and the control stays read-only.
 */
export function EditorUnlock() {
  const { canEdit, loading, unlock, lock } = useEditor();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) {
    return <div className="h-8 w-20 animate-pulse rounded-xl bg-sand-200" />;
  }

  if (canEdit) {
    return (
      <Button variant="outline" size="sm" onClick={() => void lock()}>
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        Editing
      </Button>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const ok = await unlock(password);
    setBusy(false);
    if (ok) {
      setOpen(false);
      setPassword("");
    } else {
      setError("Wrong password, or editing is not available in this preview.");
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Unlock editing
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Unlock editing"
          onClick={() => setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-surface p-6 shadow-xl"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-ink-900">
                Unlock editing
              </h2>
              <p className="text-sm text-muted">
                Enter the editor password to make changes. Everyone else sees a
                read-only plan.
              </p>
            </div>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Editor password"
              className="rounded-xl border border-[color:var(--border)] bg-surface px-3 py-2 text-ink-900 outline-none focus:ring-2 focus:ring-ember-400/40"
            />
            {error ? <p className="text-sm text-clay-700">{error}</p> : null}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={busy || !password}>
                {busy ? "Checking…" : "Unlock"}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
