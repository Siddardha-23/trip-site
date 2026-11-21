import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RentalPanel } from "@/components/rental/RentalPanel";
import { rentals } from "@/lib/seed/trip-seed";

export default function RentalPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/logistics" className="text-sm text-muted hover:text-clay-700">
        ← Logistics
      </Link>
      <SectionHeader
        title="Car rental & one-way drop-off"
        subtitle="A one-way draft: pick up in Arizona, drop in San Francisco. Unlock editing to fill in the terms."
      />
      <RentalPanel seed={rentals[0]} />
    </div>
  );
}
