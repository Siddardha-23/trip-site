"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { resolvePhotoUrl } from "@/lib/images/storage";
import type { Photo } from "@/lib/types";

/**
 * Full-screen lightbox for a selected photo, with keyboard navigation
 * (Escape to close, arrows to move). Falls back to the caption placeholder for
 * seeded photos that have no image yet.
 */
export function PhotoLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const photo = photos[index];

  const go = useCallback(
    (delta: number) => {
      const next = (index + delta + photos.length) % photos.length;
      onNavigate(next);
    },
    [index, photos.length, onNavigate],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  if (!photo) return null;
  const src = resolvePhotoUrl(photo.url);
  const label = photo.caption ?? "Trip photo";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex flex-col bg-ink-900/90 backdrop-blur"
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 text-white">
        <span className="text-sm">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full px-3 py-1 text-sm hover:bg-white/10"
        >
          Close ✕
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-16"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
        >
          ‹
        </button>

        <figure className="flex max-h-full max-w-3xl flex-col items-center gap-3">
          <div className="relative aspect-[4/3] w-[min(90vw,48rem)] overflow-hidden rounded-2xl bg-sand-100">
            {src ? (
              <Image
                src={src}
                alt={label}
                fill
                sizes="90vw"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand-200 via-sand-100 to-ember-400/30 p-6 text-center text-sm font-medium text-ink-800">
                {label}
              </div>
            )}
          </div>
          <figcaption className="text-center text-sm text-white/90">
            {label}
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
        >
          ›
        </button>
      </div>
    </div>
  );
}
