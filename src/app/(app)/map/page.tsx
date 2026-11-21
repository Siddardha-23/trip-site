import { SectionHeader } from "@/components/ui/SectionHeader";
import { MapSection } from "@/components/map/MapSection";

export default function MapPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Map"
        subtitle="The route from Tempe to San Francisco, with every stop."
      />
      <MapSection />
    </div>
  );
}
