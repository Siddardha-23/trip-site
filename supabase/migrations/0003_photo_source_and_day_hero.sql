-- Wire real licensed imagery into the live data.
-- Additive, nullable, no data loss. Run AFTER 0002_day_experiences.sql.
--
--   * photos.source   — attribution / licence note for freely-licensed imagery
--                       (Wikimedia Commons). Mirrors Photo.source in types.ts.
--   * days.hero_image — optional per-day hero image {url, source} as jsonb.
--                       Mirrors Day.heroImage (DayHeroImage) in types.ts; the
--                       generic camelCase<->snake_case mapping in
--                       src/lib/data/mapping.ts carries hero_image -> heroImage.

alter table public.photos add column if not exists source text;

alter table public.days add column if not exists hero_image jsonb;
