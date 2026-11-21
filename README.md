# Arizona to San Francisco — shared trip planner

A mobile- and desktop-friendly web app for planning and sharing one road trip:
Tempe, Arizona to San Francisco over five nights (Dec 27 – Jan 1, four
travelers). It keeps the whole plan in one place — route, day-by-day itinerary,
map, group, money, logistics and a photo gallery — instead of scattered across a
group chat, plus a public "Moments" recap page to share the trip.

Built with Next.js 16 (App Router, TypeScript) and Tailwind v4, deployed to
Vercel's free tier, backed by Supabase's free tier (Postgres + Storage +
Realtime) and the Google Maps JavaScript API.

## Segments

- **Dashboard** — the trip at a glance: countdown, progress and the route ledger.
- **Itinerary** — day-by-day plan with driving legs, stops and notes.
- **Map** — the overview route with an animated car marker (static fallback when no Maps key is set).
- **Group** — travelers, RSVPs and who can drive.
- **Money** — expense splitting and the budget tracker (what is priced and what is not).
- **Logistics** — car rental / one-way drop-off, driver rotation, packing checklist, document vault, weather checks and open decisions.
- **Gallery** — per-day photo grid with a lightbox; uploads are compressed in the browser before Storage.
- **Moments** — a public, shareable recap page (`/moments`) with Open Graph previews, rendered outside the app shell.

## Mock mode

With **no `.env.local`** present, the app runs entirely from in-memory seed data
(`src/lib/seed/trip-seed.ts`, transcribed verbatim from the itinerary source).
Every segment renders and is navigable with no secrets, no database and no
network backend. This is the default for local development and CI checks.

Adding the Supabase / Maps / editor environment variables switches on the live
backend: Supabase reads + realtime sync, editor-gated server-side writes, and
photo/document uploads to Supabase Storage. See **[SETUP.md](./SETUP.md)**.

## Editor mode

The site is read-only by default. Entering the shared `EDITOR_PASSWORD` unlocks
editing (`POST /api/editor/unlock` sets an httpOnly cookie); all mutations are
gated behind it and performed server-side with the Supabase service-role key.
The public `/moments` page is never editor-gated.

## Develop

```powershell
npm install
npm run dev     # http://localhost:3000 (mock mode without .env.local)

npm run lint
npx tsc --noEmit
npm run build
```

## Free-tier guardrails

- No paid Vercel or Supabase features; no always-on server processes.
- Images are compressed client-side before upload to protect Storage/egress.
- The Google Maps key must be HTTP-referrer restricted with a hard quota cap so it can never incur charges.
- Never hardcode secrets; they are read from environment variables. `.env.local` is git-ignored; only `.env.local.example` (placeholders) is committed.

See **[SETUP.md](./SETUP.md)** for exact Supabase, Maps, env and Vercel steps.

<!-- auto-deploy link verified -->
