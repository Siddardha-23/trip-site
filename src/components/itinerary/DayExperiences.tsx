import { Card } from "@/components/ui/Card";
import type { DayExperiences as DayExperiencesData, ExperienceItem } from "@/lib/types";

/**
 * Presentational server component (no "use client", no cookies/headers/
 * searchParams) so the day page stays statically prerenderable under
 * cacheComponents. Renders the soulful, experiential layer: a feeling line,
 * grouped viewpoints/hidden gems/food culture, and the NYE block.
 */
export function DayExperiences({ data }: { data: DayExperiencesData }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-ink-800">{data.feeling}</p>

      <ExperienceGroup
        heading="Scenic viewpoints"
        items={data.viewpoints}
      />
      <ExperienceGroup
        heading="Hidden gems & local corners"
        items={data.hiddenGems}
      />
      <ExperienceGroup
        heading="Food & culture"
        items={data.foodCulture}
      />

      {data.nye && data.nye.length > 0 ? <NyeBlock data={data.nye} /> : null}
    </div>
  );
}

function ExperienceGroup({
  heading,
  items,
}: {
  heading: string;
  items: ExperienceItem[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium uppercase tracking-wide text-ember-600">
        {heading}
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Card key={item.title} className="flex flex-col gap-1">
            <span className="font-semibold text-ink-900">{item.title}</span>
            <p className="text-sm text-ink-800">{item.detail}</p>
            {item.source ? <SourceLink href={item.source} /> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}

function NyeBlock({
  data,
}: {
  data: NonNullable<DayExperiencesData["nye"]>;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ember-600/30 bg-ember-600/5 p-5">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-ember-600">
          New Year&rsquo;s Eve · Ring in 2027
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-ink-900">
          Where to celebrate in San Francisco
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <Card key={item.spot} className="flex flex-col gap-1">
            <span className="font-semibold text-ink-900">{item.spot}</span>
            <p className="text-sm text-ink-800">{item.detail}</p>
            {item.crowdNote ? (
              <p className="text-sm text-muted">{item.crowdNote}</p>
            ) : null}
            {item.source ? <SourceLink href={item.source} /> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}

function SourceLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-clay-700 underline underline-offset-2 hover:text-ember-600"
    >
      Source
    </a>
  );
}
