import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function GroupPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Group"
        subtitle="Who's coming, RSVPs and the driver rotation."
      />
      <EmptyState
        title="The group roster is on its way"
        description="RSVPs, traveler details and the driver rotation arrive in a later update."
      />
    </div>
  );
}
