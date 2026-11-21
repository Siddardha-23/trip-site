import { SectionHeader } from "@/components/ui/SectionHeader";
import { Gallery } from "@/components/gallery/Gallery";
import { trip, photos } from "@/lib/seed/trip-seed";

export default function GalleryPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Gallery"
        subtitle="Every photo from the trip, grouped by day. Tap a photo to open it."
      />
      <Gallery days={trip.days} seed={photos} />
    </div>
  );
}
