import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MoneyPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Money"
        subtitle="The budget and a running expense split for the group."
      />
      <EmptyState
        title="The budget and expense split are on their way"
        description="The priced-vs-unpriced budget and a shared expense split arrive in a later update."
      />
    </div>
  );
}
