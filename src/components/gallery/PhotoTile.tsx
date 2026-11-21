"use client";

import Image from "next/image";
import { resolvePhotoUrl } from "@/lib/images/storage";
import type { Photo } from "@/lib/types";

/**
 * A single square gallery tile. Shows the stored image when a URL resolves,
 * otherwise a warm gradient placeholder with the caption — so seeded sample
 * photos (url: null) still read as part of the gallery in mock mode.
 */
export function PhotoTile({
  photo,
  onOpen,
}: {
  photo: Photo;
  onOpen?: () => void;
}) {
  const src = resolvePhotoUrl(photo.url);
  const label = photo.caption ?? "Trip photo";

  const inner = src ? (
    <Image
      src={src}
      alt={label}
      fill
      sizes="(max-width: 768px) 50vw, 25vw"
      className="object-cover transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-sand-200 via-sand-100 to-ember-400/30 p-3">
      <span className="text-left text-xs font-medium text-ink-800/80">
        {label}
      </span>
    </div>
  );

  const className =
    "group relative block aspect-square w-full overflow-hidden rounded-xl border border-[color:var(--border)] bg-sand-100";

  if (!onOpen) {
    return (
      <div className={className}>
        {inner}
        {src ? <Caption label={label} /> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`${className} text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-500`}
      aria-label={`Open photo: ${label}`}
    >
      {inner}
      {src ? <Caption label={label} /> : null}
    </button>
  );
}

function Caption({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-2 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
      {label}
    </span>
  );
}
