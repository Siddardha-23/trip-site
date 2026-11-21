# Implementation Plan — Arizona → San Francisco Trip-Planning Web App

Greenfield build in the empty git repo at `d:\Personal-Projects\trip-site` (branch `main`, no commits). Stack is decided and fixed: **Next.js 16 App Router + TypeScript**, **Tailwind CSS v4**, **Supabase** (Postgres + Storage + Realtime), **Google Maps JS API**, deployed to **Vercel Hobby**. Auth is a shared public view link + an editor password. Everything must stay in free tiers and must build/run in a **degraded mock mode** with no real secrets.

All seed data comes from `d:\Personal-Projects\_itinerary_extracted.txt`. Do not invent costs, mileage, or timings beyond what that document states.

Pinned versions (verified current): `next@16`, `@supabase/supabase-js@2`, `@supabase/ssr@0.12`, `@googlemaps/js-api-loader@2`, `tailwindcss@4`, `zustand@5`, `browser-image-compression@2`, `zod@4`.

Build/test commands (the project's real commands): `npm run build`, `npm run dev`, `npm run lint`, `npx tsc --noEmit`.

---

- [ ] 1. Scaffold the Next.js app and project skeleton.
      Run `npx create-next-app@latest . --typescript --app --tailwind --eslint --src-dir --import-alias "@/*" --use-npm --no-turbopack` in the repo root (directory already contains `.git` and `.agents`; scaffold into it). Then add `.gitignore` entries for `.env*.local`, write `.env.local.example` with all required variables, and set `output`/image config in `next.config.ts`. Make the **initial git commit**.
      Files: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`, `.env.local.example`.
      Verify: `npm run build` succeeds; `git status` shows `.env.local` would be ignored (create a throwaway `.env.local`, confirm `git status --ignored` lists it, delete it); `git log --oneline` shows one commit.

- [ ] 2. Define the typed domain model and seed data from the document.
      Create TypeScript types for Trip, Day, Route leg, Stop, Place, Person (RSVP), Expense, BudgetItem, DriverRotation, ChecklistItem, Document, WeatherCard, OpenDecision, Photo. Create the seed module transcribing the itinerary: 5 days, overnights (South Rim, San Diego, LA, SF×2), per-leg mileage/drive-time (270mi 4.5-5hr; 504mi 8.5-10hr; 128mi 2.5-4hr; 380mi 6-7.5hr; ~1,282mi total), 5:30am starts, stops (Sedona, Mather Point, Rim Trail, Hermit Road, Balboa Park, Griffith Observatory, Golden Gate, Palace of Fine Arts, Ferry Building, Chinatown, North Beach), costs ($35/vehicle, possible $100 non-resident, free Balboa grounds/Griffith building), seasonal/road warnings, and the 3 open decisions.
      Files: `src/lib/types.ts`, `src/lib/seed/trip-seed.ts`.
      Verify: `npx tsc --noEmit` passes.

- [ ] 3. Build the Supabase client layer with mock fallback and the editor-auth mechanism.
      Create browser and server Supabase clients using `@supabase/ssr`, reading env vars; when `NEXT_PUBLIC_SUPABASE_URL`/anon key are absent, export `supabaseAvailable = false` and have the data layer fall back to in-memory seed data. Implement a repository module exposing read/write/subscribe functions for each entity that route to Supabase when available and to an in-memory store (hydrated from seed) otherwise. Implement editor unlock: a Route Handler `POST /api/editor/unlock` comparing a submitted password to `EDITOR_PASSWORD` (server-only), setting an httpOnly signed cookie; a client hook `useEditor()` exposing `canEdit`.
      Files: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/data/repository.ts`, `src/lib/data/mock-store.ts`, `src/app/api/editor/unlock/route.ts`, `src/app/api/editor/status/route.ts`, `src/hooks/use-editor.ts`.
      Verify: `npm run build` and `npx tsc --noEmit` pass with no `.env.local` present (mock mode).

- [ ] 4. Author the SQL schema migration and seed SQL.
      Write a committed SQL migration creating all tables matching the domain model, with RLS enabled: public `SELECT` for everyone (anon), and `INSERT/UPDATE/DELETE` gated so the client uses the anon key for reads and a server Route Handler using the service role key for writes (editor-gated). Enable Realtime on `expenses`, `people`, `stops`, `checklist_items`, `open_decisions`. Create a Storage bucket config note for `photos` and `documents`. Write a seed SQL mirroring `trip-seed.ts`.
      Files: `supabase/migrations/0001_init.sql`, `supabase/seed.sql`.
      Verify: SQL parses (run `npx sql-formatter` is not required); manual review that every `types.ts` entity has a table and column match. Build unaffected: `npm run build` still passes.

- [ ] 5. Build the app shell: responsive layout, segmented navigation, and warm visual theme.
      Create the root layout with a mobile-first bottom tab bar + desktop sidebar, a header with trip title and editor-unlock button, Tailwind theme tokens (warm palette, typography) in `globals.css`, and shared UI primitives (Card, Button, Badge, Stat, SectionHeader, EmptyState, EditableField). Segments: Dashboard, Itinerary, Map, Group, Money, Logistics, Moments.
      Files: `src/app/layout.tsx`, `src/components/nav/*`, `src/components/ui/*`, `src/app/globals.css`.
      Verify: `npm run dev`, load `/`, confirm nav renders and routes resolve on mobile and desktop widths; `npm run lint` passes.

- [ ] 6. Build the Dashboard home ("plan at a glance"), countdown, and trip-progress tracker.
      Dashboard page showing trip summary stats (5 nights, 4 bases, ~1,282 mi, ~21.4 hr), the route ledger, a live countdown to Dec 27, and a trip-progress indicator. Warm, personal tone.
      Files: `src/app/(app)/page.tsx` (or `src/app/page.tsx`), `src/components/dashboard/*`, `src/components/countdown/*`.
      Verify: `npm run dev`, dashboard renders all stats from seed; `npx tsc --noEmit` passes.

- [ ] 7. Build the day-by-day itinerary with editable timings, routes, mileage, stops.
      Itinerary index + per-day pages rendering the 5 days with legs, drive-times, 5:30am starts, per-stop notes, and the editable places/stops library (add/remove) per day. Edits call the repository; gated by `canEdit`. In mock mode edits mutate the in-memory store.
      Files: `src/app/(app)/itinerary/page.tsx`, `src/app/(app)/itinerary/[day]/page.tsx`, `src/components/itinerary/*`, `src/components/places/*`.
      Verify: `npm run dev`, all 5 days render with correct seed mileage/timings; adding a stop in mock mode appears in the list; `npm run lint` passes.

- [ ] 8. Build the car-rental / one-way drop-off panel.
      Editable manual fields: company, pickup/drop locations, dates, base rate, one-way drop fee, notes. Persists via repository; mock fallback.
      Files: `src/app/(app)/logistics/rental/page.tsx` (or a card within Logistics), `src/components/rental/*`.
      Verify: `npm run dev`, panel renders and fields edit in mock mode; `npx tsc --noEmit` passes.

- [ ] 9. Build the Google Maps route map with animated car marker and live-location sync.
      Load the Maps JS API via `@googlemaps/js-api-loader` using `GOOGLE_MAPS_API_KEY` exposed to the client through a public env var or a server-proxied key; draw the intercity route (polyline through the overnight bases), animate a car marker along the polyline, and show live user location when permission granted and shared via Realtime. When the key is absent, render a static styled fallback map panel with the route list (degraded mode) — no crash.
      Files: `src/app/(app)/map/page.tsx`, `src/components/map/*`, `src/lib/maps/*`.
      Verify: `npm run build` passes with no Maps key (fallback renders); with a key, `npm run dev` shows the animated marker. Confirm fallback path renders in mock mode.

- [ ] 10. Build the Group manager: people/headcount (5–15) with RSVP, realtime.
      People list supporting 5–15 entries with RSVP status (going/maybe/no), add/remove, headcount summary. Realtime subscription updates the list live when Supabase is available; mock store otherwise.
      Files: `src/app/(app)/group/page.tsx`, `src/components/group/*`.
      Verify: `npm run dev`, list renders seeded 4 adults, can add up to 15 in mock mode; `npm run lint` passes.

- [ ] 11. Build the Money section: expense splitter, budget tracker, driver rotation.
      Expense splitter (who paid, who owes, running balances, settle-up), realtime sync; budget tracker mapped to the document's priced/not-priced list (fuel, parking, $35 park fee, hotels, food); driver-rotation tracker with the "rotate only rested drivers" warning. Balances computed client-side.
      Files: `src/app/(app)/money/page.tsx`, `src/components/expenses/*`, `src/components/budget/*`, `src/components/drivers/*`, `src/lib/money/split.ts`.
      Verify: `npm run dev`, add an expense split across 4 people, balances compute correctly; unit-check `split.ts` logic by rendering; `npx tsc --noEmit` passes.

- [ ] 12. Build the Logistics section: packing checklist, document vault, weather/road cards, open-decisions tracker.
      Shared checkable packing list seeded with NPS winter gear (layers, food, water, scraper, flashlight, over-shoe traction); document vault uploading hotel/booking confirmations to Supabase Storage (`documents` bucket), degraded to a local-only list in mock mode; weather/road reminder cards (24–48h Grand Canyon forecast/road check); open-decisions tracker seeded with the 3 document decisions (return leg, whole-trip budget, who drives the full route).
      Files: `src/app/(app)/logistics/page.tsx`, `src/components/checklist/*`, `src/components/vault/*`, `src/components/weather/*`, `src/components/decisions/*`.
      Verify: `npm run dev`, checklist items toggle, decisions render seeded, vault shows upload UI (disabled/mock without Storage); `npm run lint` passes.

- [ ] 13. Build the photo gallery with client-side compression.
      Per-day/per-place gallery uploading to Supabase Storage (`photos` bucket) after resizing/compressing with `browser-image-compression` before upload (free-tier protection). Mock mode shows seeded sample state and a disabled uploader. Thumbnails + lightbox.
      Files: `src/app/(app)/gallery/page.tsx`, `src/components/gallery/*`, `src/lib/images/compress.ts`.
      Verify: `npm run dev`, gallery grid renders; compression util typechecks; `npx tsc --noEmit` passes.

- [ ] 14. Build the public "Moments" shareable recap page.
      A beautiful, Instagram-grade public page (no editor gate) stitching the journey: hero, route, day highlights, photo highlights, warm copy. Open Graph/Twitter card meta for sharing. Accessible and fast.
      Files: `src/app/moments/page.tsx`, `src/components/moments/*`, Open Graph metadata.
      Verify: `npm run build`, `/moments` renders in mock mode with seed content; Lighthouse-style check that it loads without secrets.

- [ ] 15. Write SETUP.md, finalize Vercel config, and run full verification.
      `SETUP.md` with exact steps: (1) create Supabase project, run `supabase/migrations/0001_init.sql` and `supabase/seed.sql`, create `photos`/`documents` Storage buckets; (2) create and **restrict** a Google Maps API key — HTTP-referrer restriction + a **hard quota cap** so it can never incur charges; (3) populate `.env.local` from `.env.local.example`; (4) deploy to Vercel (set env vars in project settings). Confirm `.env.local.example` is complete and `.env.local` is gitignored.
      Files: `SETUP.md`, `README.md`, `.env.local.example` (final check).
      Verify: `npm run build` clean, `npm run lint` clean, `npx tsc --noEmit` clean; `npm run dev` loads every section navigable in mock mode with no `.env.local`; `.env.local` is ignored by git.

---

## Digest

This is a greenfield project; no existing files to cite. Files the plan creates, grouped by the item that creates them:

- **Scaffold (item 1):** `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`, `.env.local.example`. Build command `npm run build`; lint `npm run lint`; typecheck `npx tsc --noEmit`. Nothing passes today — repo is empty; item 1 establishes the green baseline.
- **Domain + seed (item 2):** `src/lib/types.ts`, `src/lib/seed/trip-seed.ts`. Covered by typecheck.
- **Data layer + auth (item 3):** `src/lib/supabase/{client,server}.ts`, `src/lib/data/{repository,mock-store}.ts`, `src/app/api/editor/{unlock,status}/route.ts`, `src/hooks/use-editor.ts`. Covered by build in mock mode.
- **SQL (item 4):** `supabase/migrations/0001_init.sql`, `supabase/seed.sql`. Covered by column-vs-type review.
- **Shell/nav/theme (item 5):** `src/app/layout.tsx`, `src/components/nav/*`, `src/components/ui/*`, `src/app/globals.css`. Covered by `npm run dev` render + lint.
- **Feature sections (items 6–14):** pages under `src/app/(app)/*` and `src/app/moments/page.tsx`, components under `src/components/*`, utils under `src/lib/*`. Each covered by `npm run dev` render of that route plus typecheck/lint.
- **Docs + verification (item 15):** `SETUP.md`, `README.md`. Covered by the full build/lint/typecheck gate.

Verified during exploration: repo is an empty git repo on `main` with no commits; Node v24.13.0 / npm 11.10.0; current package versions as pinned above; Tailwind v4 uses CSS-first config with `@tailwindcss/postcss`; Next 16 `create-next-app` scaffolds this automatically. The whole app must build and render in mock mode with no secrets, which every verify step enforces.
