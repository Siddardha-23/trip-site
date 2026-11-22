// Per-day visual theme tokens. Each Day.theme.key maps to ONE token set here,
// so a day's palette/gradient/accent is defined once (not hardcoded per page).
// Plain data module — no "use client", no DOM — so server components can use it.
import type { CSSProperties } from "react";

/** The resolved token set for a single day's theme. */
export interface DayThemeTokens {
  /** CSS gradient string used as the hero background. */
  hero: string;
  /** Primary accent color (buttons, badges, rules). */
  accent: string;
  /** Secondary accent color for subtle tints. */
  accentSoft: string;
  /** Text tone to sit legibly on top of the hero gradient. */
  onHero: string;
}

/**
 * The inline CSS custom properties a day applies to its hero/accents. Returned
 * as a typed style object so a server component can spread it onto an element.
 */
export interface DayThemeVars extends CSSProperties {
  "--day-hero": string;
  "--day-accent": string;
  "--day-accent-soft": string;
  "--day-on-hero": string;
}

/** Safe default used when a day has no theme or an unknown key. */
const DEFAULT_THEME: DayThemeTokens = {
  hero: "linear-gradient(135deg, #c4531f 0%, #e05a63 45%, #ffc062 100%)",
  accent: "#c4531f",
  accentSoft: "#f0dcc1",
  onHero: "#fffaf3",
};

/** The five finalized day themes, keyed by Day.theme.key. */
const DAY_THEMES: Record<string, DayThemeTokens> = {
  "red-rock-to-rim": {
    // Sedona sunrise amber shifting to canyon rust.
    hero: "linear-gradient(135deg, #f4a259 0%, #d9622b 50%, #8a2f16 100%)",
    accent: "#b4471d",
    accentSoft: "#f6d9bd",
    onHero: "#fff7ee",
  },
  "canyon-to-coast": {
    // Desert tan shifting to Pacific blue.
    hero: "linear-gradient(135deg, #d8a95f 0%, #4a91a8 55%, #1f5f7a 100%)",
    accent: "#1f5f7a",
    accentSoft: "#cfe3ea",
    onHero: "#f4fbff",
  },
  "city-of-angels": {
    // Golden-hour dusk over the LA basin.
    hero: "linear-gradient(135deg, #ffb457 0%, #e0607a 50%, #6b3d8f 100%)",
    accent: "#9a3f7a",
    accentSoft: "#f3d6e2",
    onHero: "#fff5f8",
  },
  "pacific-turn": {
    // Coastal fog over teal water.
    hero: "linear-gradient(135deg, #cdd9d6 0%, #4f9c99 55%, #1d5f63 100%)",
    accent: "#1d5f63",
    accentSoft: "#d2e6e4",
    onHero: "#f2fbfa",
  },
  "big-sur-midnight": {
    // Cliff greens into New Year's gold and navy.
    hero: "linear-gradient(135deg, #3f6f52 0%, #1b2a4a 55%, #d9a441 100%)",
    accent: "#2f4a74",
    accentSoft: "#dfe4ef",
    onHero: "#f6f8ff",
  },
};

/** Resolve the token set for a theme key, falling back to a safe default. */
export function getDayTheme(key: string | undefined): DayThemeTokens {
  if (!key) return DEFAULT_THEME;
  return DAY_THEMES[key] ?? DEFAULT_THEME;
}

/**
 * Build the inline CSS custom properties for a theme key. Spread the result
 * onto an element's `style` so `.day-hero` and `.day-accent` helpers (and any
 * `var(--day-*)` usage) resolve to this day's palette.
 */
export function dayThemeVars(key: string | undefined): DayThemeVars {
  const t = getDayTheme(key);
  return {
    "--day-hero": t.hero,
    "--day-accent": t.accent,
    "--day-accent-soft": t.accentSoft,
    "--day-on-hero": t.onHero,
  };
}
