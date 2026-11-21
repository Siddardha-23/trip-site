# Setup & Deploy

This app runs in two modes:

- **Mock mode** (no `.env.local`): the whole site renders from in-memory seed data (`src/lib/seed/trip-seed.ts`). Every segment is navigable, but there is no persistence, no realtime sync, no editor writes, and no photo/document uploads.
- **Live mode** (env vars set): reads and realtime come from Supabase; editor-gated writes go through the server with the service-role key; photos and documents upload to Supabase Storage.

Follow the four sections below to go from mock mode to a deployed, live site. Everything here stays within the Supabase, Vercel and Google Maps free tiers.

---

## 1. Supabase project (database + storage)

1. Create a Supabase project at <https://supabase.com/dashboard> (the Free plan is enough).
2. Open the project's **SQL Editor** and run the schema migration, then the seed, in this order:
   - Run **`supabase/migrations/0001_init.sql`** — creates one table per entity, enables Row Level Security with a public (anon) `SELECT` policy and **no** anon write policy, and registers realtime for the collaborative tables.
   - Run **`supabase/seed.sql`** — inserts the trip, days, stops, places, travelers and the planning data transcribed from the itinerary.
3. Create two **Storage** buckets (Storage → New bucket):
   - **`photos`** — set it to **Public** (public read). Gallery and Moments images are served from public URLs. Images are compressed in the browser before upload (`src/lib/images/compress.ts`) to protect the free-tier storage and egress budget.
   - **`documents`** — keep it **Private** (not public). Vault files are reached through short-lived signed URLs, never public links.

   > Writes to both buckets happen only in editor mode. The anon key can read the `photos` bucket; the service-role key (server only) performs the uploads.

4. From **Project Settings → API**, copy the **Project URL**, the **anon public** key and the **service_role** key for section 3.

## 2. Google Maps API key (restricted + hard-capped)

1. In the [Google Cloud Console](https://console.cloud.google.com/), create (or select) a project and enable the **Maps JavaScript API**.
2. Create an **API key** under **APIs & Services → Credentials**.
3. **Restrict the key so it can never incur charges:**
   - **Application restriction → HTTP referrers (web sites).** Add your Vercel domain(s), e.g. `https://your-app.vercel.app/*` and, for local work, `http://localhost:3000/*`. This stops the key from being used from any other origin even if it leaks (it ships in the browser bundle).
   - **API restriction → restrict to the Maps JavaScript API** only.
   - **Set a HARD quota cap.** In **APIs & Services → Maps JavaScript API → Quotas**, lower the daily request limit (e.g. "Map loads per day") to a value comfortably inside the free monthly credit. A hard cap means requests are rejected rather than billed once the limit is hit, so the key can never run up a charge.
4. The map degrades gracefully to a static route fallback when no key is present, so this step is optional for a text-only deploy.

## 3. Local environment variables

1. Copy the example file and fill in real values:
   ```powershell
   Copy-Item .env.local.example .env.local
   ```
2. Fill every variable in `.env.local`:
   - `GOOGLE_MAPS_API_KEY` — the Maps key (server reference / build-time).
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — the **referrer-restricted, quota-capped** Maps key for the client map. Any `NEXT_PUBLIC_*` value ships to the browser, so only expose the restricted key.
   - `NEXT_PUBLIC_SUPABASE_URL` — the Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the Supabase anon/public key (safe to expose with RLS on).
   - `SUPABASE_SERVICE_ROLE_KEY` — the Supabase service-role key. **Server only — never expose it to the client.**
   - `EDITOR_PASSWORD` — a strong shared password that unlocks editor mode via `POST /api/editor/unlock`.
3. `.env.local` is git-ignored (see `.gitignore`) and must never be committed. Only `.env.local.example` (placeholders) is committed.
4. Run the app locally:
   ```powershell
   npm install
   npm run dev
   ```
   Open <http://localhost:3000>.

## 4. Deploy to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket (this project commits locally only; you add a remote when you are ready).
2. In Vercel, **Add New → Project** and import the repository. Vercel auto-detects Next.js; no build setting changes are needed.
3. In **Project Settings → Environment Variables**, add the same six variables from section 3 (`GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `EDITOR_PASSWORD`) for the Production (and Preview) environments.
4. Add the deployed Vercel domain to the Maps key's HTTP-referrer allow-list (section 2).
5. **Deploy.** The Hobby (free) plan is sufficient.

---

## Verification (mock mode)

With **no `.env.local`** present:

```powershell
npm run lint
npx tsc --noEmit
npm run build
npm run dev   # then load http://localhost:3000
```

Every segment — Dashboard, Itinerary, Map, Group, Money, Logistics, Gallery — and the public `/moments` recap renders and is navigable without any secrets.
