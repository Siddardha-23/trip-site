import { SectionHeader } from "@/components/ui/SectionHeader";
import { RentalPanel } from "@/components/rental/RentalPanel";
import { Checklist } from "@/components/checklist/Checklist";
import { DocumentVault } from "@/components/vault/DocumentVault";
import { WeatherCards } from "@/components/weather/WeatherCards";
import { DecisionsTracker } from "@/components/decisions/DecisionsTracker";
import {
  checklistItems,
  openDecisions,
  rentals,
  weatherCards,
} from "@/lib/seed/trip-seed";

export default function LogisticsPage() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeader
        title="Logistics"
        subtitle="The car, the packing, documents and the moving parts that keep the trip running."
      />

      <section>
        <SectionHeader
          title="Car rental & one-way drop-off"
          subtitle="A one-way draft: pick up in Arizona, drop in San Francisco. Unlock editing to fill in the terms."
        />
        <RentalPanel seed={rentals[0]} />
      </section>

      <section>
        <SectionHeader
          title="Packing checklist"
          subtitle="NPS winter gear for the Grand Canyon. Tap to check off items."
        />
        <Checklist seed={checklistItems} />
      </section>

      <section>
        <SectionHeader
          title="Weather & road checks"
          subtitle="Recheck the Grand Canyon forecast and roads 24-48 hours before driving."
        />
        <WeatherCards seed={weatherCards} />
      </section>

      <section>
        <SectionHeader
          title="Document vault"
          subtitle="Hotel and booking confirmations, kept with the trip."
        />
        <DocumentVault seed={[]} />
      </section>

      <section>
        <SectionHeader
          title="Open decisions"
          subtitle="What turns this draft into a bookable plan."
        />
        <DecisionsTracker seed={openDecisions} />
      </section>
    </div>
  );
}
