import { SectionHeader } from "@/components/ui/SectionHeader";
import { RentalPanel } from "@/components/rental/RentalPanel";
import { rentals } from "@/lib/seed/trip-seed";

export default function LogisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Logistics"
        subtitle="The car, the drop-off and the moving parts that keep the trip running."
      />
      <section>
        <SectionHeader
          title="Car rental & one-way drop-off"
          subtitle="A one-way draft: pick up in Arizona, drop in San Francisco. Unlock editing to fill in the terms."
        />
        <RentalPanel seed={rentals[0]} />
      </section>
    </div>
  );
}
