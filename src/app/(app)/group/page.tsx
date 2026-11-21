import { SectionHeader } from "@/components/ui/SectionHeader";
import { GroupManager } from "@/components/group/GroupManager";
import { people } from "@/lib/seed/trip-seed";

export default function GroupPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Group"
        subtitle="Who's coming and their RSVP. Supports 5 to 15 travelers."
      />
      <GroupManager seed={people} />
    </div>
  );
}
