import type { Metadata } from "next";
import Link from "next/link";
import { MomentsHero } from "@/components/moments/MomentsHero";
import { MomentsRoute } from "@/components/moments/MomentsRoute";
import { MomentsDays } from "@/components/moments/MomentsDays";
import { MomentsGallery } from "@/components/moments/MomentsGallery";
import { trip, photos } from "@/lib/seed/trip-seed";

const DESCRIPTION =
  "Four friends, one road, and five nights from the red rocks of Arizona to the fog of San Francisco.";

// Open Graph + Twitter card so the shared link previews well on social apps.
export const metadata: Metadata = {
  title: `${trip.title} · ${trip.subtitle}`,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: `${trip.title} · ${trip.subtitle}`,
    description: DESCRIPTION,
    siteName: trip.title,
  },
  twitter: {
    card: "summary_large_image",
    title: `${trip.title} · ${trip.subtitle}`,
    description: DESCRIPTION,
  },
};

/**
 * Public, NOT editor-gated recap page. It lives outside the (app) shell so a
 * shared link opens straight into a warm, full-bleed story. Renders fully in
 * mock mode from the seed.
 */
export default function MomentsPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <MomentsHero trip={trip} />
      <MomentsRoute trip={trip} />
      <MomentsDays days={trip.days} />
      <MomentsGallery photos={photos} />

      <footer className="mx-auto w-full max-w-3xl px-6 pb-16 pt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ember-600"
        >
          Open the full trip plan →
        </Link>
        <p className="mt-6 text-xs text-muted">
          A planning draft. Nothing is booked yet.
        </p>
      </footer>
    </main>
  );
}
