"use client";

import { useCallback, useEffect, useState } from "react";
import { list, subscribe } from "@/lib/data/repository";
import type { EntityMap, EntityName } from "@/lib/data/entities";

interface UseEntityListResult<K extends EntityName> {
  items: EntityMap[K][];
  loading: boolean;
  refresh: () => void;
}

/**
 * List an entity through the repository and keep it in sync via the repository's
 * subscribe (Supabase realtime, or the mock store's pub/sub in mock mode).
 * `seed` renders immediately on first paint so server/client markup agrees.
 */
export function useEntityList<K extends EntityName>(
  entity: K,
  seed: EntityMap[K][],
): UseEntityListResult<K> {
  const [items, setItems] = useState<EntityMap[K][]>(seed);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    void list(entity).then((next) => {
      setItems(next);
      setLoading(false);
    });
  }, [entity]);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribe(entity, refresh);
    return unsubscribe;
  }, [entity, refresh]);

  return { items, loading, refresh };
}
