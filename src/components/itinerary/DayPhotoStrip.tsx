import Image from "next/image";
import { resolvePhotoUrl } from "@/lib/images/storage";
import type { Photo } from "@/lib/types";

/**
 * A horizontal strip of the day's photos. Follows the build-safe PhotoTile
 * pattern: next/image when a URL resolves, otherwise a themed gradient
 * placeholder with the caption. No licensed remote URL is wired, so these
 * render as tasteful themed gradient tiles — the accepted build-safe default.
 *
 * Server component (no cookies/headers) so the page stays in the PPR shell.
 */
export function DayPhotoStrip({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo) => (
        <li key={photo.id}>
          <DayPhotoTile photo={photo} />
        </li>
      ))}
    </ul>
  );
}

function DayPhotoTile({ photo }: { photo: Photo }) {
  const src = resolvePhotoUrl(photo.url);
  const label = photo.caption ?? "Trip photo";

  return (
    <figure className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-[color:var(--border)]">
      {src ? (
        <>
          <Image
            src={src}
            alt={label}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-2 text-xs font-medium text-white">
            {label}
          </figcaption>
        </>
      ) : (
        <div className="day-photo-fallback flex h-full w-full flex-col justify-end p-3">
          <figcaption className="text-left text-xs font-medium text-ink-900/80">
            {label}
          </figcaption>
        </div>
      )}
    </figure>
  );
}
