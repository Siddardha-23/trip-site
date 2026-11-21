import type { Photo } from "@/lib/types";

/**
 * Photo highlights strip for the public recap. This is server-rendered from the
 * seed so the shared link previews and loads fast with no client JS. Seeded
 * placeholder photos (url: null) render as warm captioned tiles; once real
 * photos exist, the interactive gallery lives on the in-app /gallery page.
 */
export function MomentsGallery({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-10">
      <h2 className="mb-6 text-center text-xl font-semibold tracking-tight text-ink-900">
        Moments from the road
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo) => (
          <figure
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-xl border border-[color:var(--border)] bg-sand-100"
          >
            <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-sand-200 via-sand-100 to-ember-400/30 p-3">
              <figcaption className="text-xs font-medium text-ink-800/80">
                {photo.caption ?? "Trip photo"}
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
