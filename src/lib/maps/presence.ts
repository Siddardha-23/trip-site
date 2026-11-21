// Opt-in live-location sharing over Supabase Realtime. Each participant who
// grants geolocation publishes their position on a shared broadcast channel;
// everyone subscribed renders the others' markers. Guarded by supabaseAvailable
// — in mock mode there is no channel and the toggle has no peers to publish to.
"use client";

import { createClient, supabaseAvailable } from "@/lib/supabase/client";
import type { LatLng } from "@/lib/maps/route";

/** A peer's shared position. */
export interface LivePosition extends LatLng {
  /** Stable id for this browser session. */
  id: string;
  /** Epoch ms of the last update, used to drop stale peers. */
  at: number;
}

const CHANNEL = "trip:live-location";

/**
 * Join the live-location channel. `onPeers` fires whenever a peer's position
 * is received. The returned handle exposes `publish` (to share this session's
 * position) and `leave` (to tear down). Returns null when Supabase is absent.
 */
export function joinLiveLocation(
  selfId: string,
  onPeer: (pos: LivePosition) => void,
): { publish: (pos: LatLng) => void; leave: () => void } | null {
  if (!supabaseAvailable) return null;
  const client = createClient();
  if (!client) return null;

  const channel = client.channel(CHANNEL, {
    config: { broadcast: { self: false } },
  });

  channel
    .on("broadcast", { event: "position" }, ({ payload }) => {
      const pos = payload as LivePosition;
      if (pos && pos.id !== selfId) onPeer(pos);
    })
    .subscribe();

  return {
    publish(pos: LatLng) {
      void channel.send({
        type: "broadcast",
        event: "position",
        payload: { id: selfId, at: Date.now(), ...pos } satisfies LivePosition,
      });
    },
    leave() {
      void client.removeChannel(channel);
    },
  };
}
