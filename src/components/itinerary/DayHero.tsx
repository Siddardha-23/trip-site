import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { dayThemeVars } from "@/lib/theme/day-themes";
import { resolvePhotoUrl } from "@/lib/images/storage";
import type { Day } from "@/lib/types";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Themed day hero. Server component (no cookies/headers) so it stays in the PPR
 * static shell. The gradient/accents come once from the theme-token module via
 * inline CSS vars, keyed off day.theme.key — a safe default covers a missing
 * theme. Reuses Badge/typography tokens to match the cohesive design language.
 */
export function DayHero({ day }: { day: Day }) {
  const themeName = day.theme?.name;
  const mood = day.theme?.mood;
  const feeling = day.experiences?.feeling;
  const heroSrc = resolvePhotoUrl(day.heroImage?.url ?? null);

  return (
    <div
      style={dayThemeVars(day.theme?.key)}
      className="day-hero day-hero-animate relative isolate flex flex-col gap-4 overflow-hidden rounded-3xl p-6 shadow-sm sm:p-8"
    >
      {heroSrc ? (
        <>
          {/* Real licensed photo behind the content. The theme gradient below
              stays as a scrim so the per-day mood reads and text is legible. */}
          <Image
            src={heroSrc}
            alt={day.theme?.name ? `${day.theme.name} — ${day.title}` : day.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="-z-20 object-cover"
          />
          <div className="day-hero-scrim absolute inset-0 -z-10" aria-hidden />
        </>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-white/20 text-[color:var(--day-on-hero)] backdrop-blur-sm">
          Day {day.dayNumber}
        </Badge>
        <span className="text-sm font-medium text-[color:var(--day-on-hero)]/90">
          {day.weekday}, {formatDate(day.date)}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {themeName ? (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--day-on-hero)]/80">
            {themeName}
            {mood ? ` · ${mood}` : ""}
          </span>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--day-on-hero)] sm:text-3xl">
          {day.title}
        </h1>
        {feeling ? (
          <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--day-on-hero)]/90">
            {feeling}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className="bg-white/15 text-[color:var(--day-on-hero)]">
          {day.overnight ? `Overnight · ${day.overnight}` : "Checkout day"}
        </Badge>
      </div>
    </div>
  );
}
