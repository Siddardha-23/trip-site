import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MapPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Map"
        subtitle="The route from Tempe to San Francisco, with every stop."
      />
      <EmptyState
        title="The live map is on its way"
        description="The route map with driving legs and animated car markers arrives in a later update. For now, see the day-by-day drive in the Itinerary."
      />
    </div>
  );
}
