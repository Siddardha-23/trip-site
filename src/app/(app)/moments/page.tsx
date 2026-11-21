import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MomentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Moments"
        subtitle="The gallery of photos and the memories worth sharing."
      />
      <EmptyState
        title="The gallery is on its way"
        description="A shared photo gallery and a public moments page arrive in a later update."
      />
    </div>
  );
}
