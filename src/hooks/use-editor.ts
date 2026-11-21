// Client hook exposing editor-mode state and unlock/lock actions. Calls the
// /api/editor/* route handlers. In mock mode there is no EDITOR_PASSWORD set,
// so unlock will fail (canEdit stays false) and the UI simply stays read-only.
"use client";

import { useCallback, useEffect, useState } from "react";

interface UseEditorResult {
  canEdit: boolean;
  loading: boolean;
  /** Attempt to unlock editor mode. Returns true on success. */
  unlock: (password: string) => Promise<boolean>;
  /** Clear editor mode. */
  lock: () => Promise<void>;
}

export function useEditor(): UseEditorResult {
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/editor/status", { cache: "no-store" });
      const json = (await res.json()) as { canEdit?: boolean };
      setCanEdit(Boolean(json.canEdit));
    } catch {
      setCanEdit(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/editor/status", { cache: "no-store" })
      .then((res) => res.json() as Promise<{ canEdit?: boolean }>)
      .then((json) => {
        if (active) setCanEdit(Boolean(json.canEdit));
      })
      .catch(() => {
        if (active) setCanEdit(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const unlock = useCallback(
    async (password: string): Promise<boolean> => {
      const res = await fetch("/api/editor/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const ok = res.ok;
      await refresh();
      return ok;
    },
    [refresh],
  );

  const lock = useCallback(async (): Promise<void> => {
    await fetch("/api/editor/lock", { method: "POST" }).catch(() => {});
    await refresh();
  }, [refresh]);

  return { canEdit, loading, unlock, lock };
}
