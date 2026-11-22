import { Card } from "@/components/ui/Card";
import type { Day } from "@/lib/types";

interface InfoCard {
  heading: string;
  items: string[];
}

/** Keyword buckets for classifying a day's notes into info cards. */
const LODGING_RE = /lodging|motel|hotel|room|overnight|night:|per person|check out|checkout/i;
const FEES_RE = /\$|fee|entry|admission|parking|ticket|priced|rental/i;
const SAFETY_RE =
  /winter|snow|ice|icy|traction|layers|forecast|road|closure|caltrans|nps|daylight|fuel|driver|rotate|safe/i;

/**
 * Info cards for a day: lodging + est cost/person, park/tour fees, and
 * winter/safety tips. Sourced from day.notes (the seed's exact figures) and
 * classified by keyword — no figures are invented, only what the seed holds is
 * surfaced. Server component (no cookies/headers) so the page stays in the
 * PPR static shell.
 */
export function DayInfoCards({ day }: { day: Day }) {
  const lodging: string[] = [];
  const fees: string[] = [];
  const safety: string[] = [];

  for (const note of day.notes) {
    if (LODGING_RE.test(note)) {
      lodging.push(note);
    } else if (FEES_RE.test(note)) {
      fees.push(note);
    } else if (SAFETY_RE.test(note)) {
      safety.push(note);
    } else {
      // Default unclassified planning notes into lodging/overview.
      lodging.push(note);
    }
  }

  const cards: InfoCard[] = [
    { heading: "Lodging & cost", items: lodging },
    { heading: "Fees & tickets", items: fees },
    { heading: "Winter & safety", items: safety },
  ].filter((card) => card.items.length > 0);

  if (cards.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <Card key={card.heading} className="flex flex-col gap-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-[color:var(--day-accent)]">
            {card.heading}
          </h3>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-ink-800">
            {card.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
