-- trip-site initial schema.
-- One table per entity in src/lib/types.ts (snake_case columns).
-- RLS is enabled on every table with a public (anon) SELECT policy and NO anon
-- write policy: all writes go through the server using the service-role key,
-- which bypasses RLS (editor-gated in /api/mutate).
--
-- STORAGE BUCKETS (create manually via the Supabase dashboard or Storage API;
-- buckets are not created in pure SQL):
--   * photos     — gallery / moments images (public read)
--   * documents  — shared vault files (private; signed URLs)
-- Compress images client-side before upload to stay within free-tier storage.

-- ---------------------------------------------------------------------------
-- Trip (single row for this app; nested days live in the `days` table).
-- Mirrors Trip in types.ts. The nested `days` array is NOT a column.
create table if not exists public.trips (
  id text primary key,
  title text not null,
  subtitle text not null,
  start_date date not null,
  end_date date not null,
  checkout_date date not null,
  nights integer not null,
  traveler_count integer not null,
  room_setup text not null,
  total_intercity_miles numeric not null,
  total_driving_hours numeric not null,
  pace text not null,
  booking_status text not null,
  overnight_summary text not null
);

-- Day. The nested `legs` and `stops` arrays live in their own tables; legs are
-- stored inline on the day as jsonb since RouteLeg has no standalone table in
-- the entity registry, while stops are a first-class entity.
create table if not exists public.days (
  id text primary key,
  trip_id text references public.trips (id) on delete cascade,
  day_number integer not null,
  date date not null,
  weekday text not null,
  title text not null,
  overnight text,
  summary text not null,
  legs jsonb not null default '[]'::jsonb,
  notes jsonb not null default '[]'::jsonb
);

-- Stop. kind is a StopKind union stored as text.
create table if not exists public.stops (
  id text primary key,
  day_id text references public.days (id) on delete cascade,
  place_id text,
  name text not null,
  kind text not null,
  time text,
  description text
);

-- Place.
create table if not exists public.places (
  id text primary key,
  name text not null,
  city text,
  lat double precision,
  lng double precision,
  category text not null,
  description text
);

-- Person.
create table if not exists public.people (
  id text primary key,
  name text not null,
  is_adult boolean not null,
  rsvp text not null,
  can_drive boolean not null,
  avatar_color text
);

-- Expense. participant_ids is a text array.
create table if not exists public.expenses (
  id text primary key,
  description text not null,
  amount numeric not null,
  currency text not null,
  date date not null,
  payer_id text not null,
  participant_ids text[] not null default '{}',
  category text not null
);

-- BudgetItem.
create table if not exists public.budget_items (
  id text primary key,
  label text not null,
  category text not null,
  priced boolean not null,
  amount numeric,
  notes text
);

-- DriverRotation.
create table if not exists public.driver_rotations (
  id text primary key,
  day_id text not null,
  leg_id text,
  driver_id text not null,
  approved boolean not null,
  notes text
);

-- ChecklistItem.
create table if not exists public.checklist_items (
  id text primary key,
  label text not null,
  category text not null,
  checked boolean not null,
  assignee_id text
);

-- OpenDecision.
create table if not exists public.open_decisions (
  id text primary key,
  question text not null,
  detail text,
  resolved boolean not null,
  resolution text
);

-- VaultDocument.
create table if not exists public.vault_documents (
  id text primary key,
  title text not null,
  category text not null,
  url text,
  uploaded_at timestamptz,
  notes text
);

-- WeatherCard. warnings is a text array.
create table if not exists public.weather_cards (
  id text primary key,
  location text not null,
  date date not null,
  guidance text not null,
  warnings text[] not null default '{}'
);

-- Photo.
create table if not exists public.photos (
  id text primary key,
  url text,
  caption text,
  taken_at timestamptz,
  day_id text,
  place_id text,
  uploaded_by_id text
);

-- RentalAgreement. Manually editable car-rental / one-way drop-off fields.
create table if not exists public.rental_agreements (
  id text primary key,
  company text not null default '',
  pickup_location text not null default '',
  dropoff_location text not null default '',
  pickup_date text not null default '',
  dropoff_date text not null default '',
  base_rate numeric,
  one_way_drop_fee numeric,
  notes text
);

-- ---------------------------------------------------------------------------
-- Row Level Security: enable on every table, allow anon SELECT only.
-- Writes are performed server-side with the service-role key (bypasses RLS).

do $$
declare
  t text;
  tables text[] := array[
    'trips', 'days', 'stops', 'places', 'people', 'expenses', 'budget_items',
    'driver_rotations', 'checklist_items', 'open_decisions', 'vault_documents',
    'weather_cards', 'photos', 'rental_agreements'
  ];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security;', t);
    execute format(
      'drop policy if exists %I on public.%I;',
      t || '_public_select', t
    );
    execute format(
      'create policy %I on public.%I for select using (true);',
      t || '_public_select', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Realtime: publish change events for the collaborative entities.
alter publication supabase_realtime add table public.expenses;
alter publication supabase_realtime add table public.people;
alter publication supabase_realtime add table public.stops;
alter publication supabase_realtime add table public.checklist_items;
alter publication supabase_realtime add table public.open_decisions;
alter publication supabase_realtime add table public.budget_items;
alter publication supabase_realtime add table public.driver_rotations;
alter publication supabase_realtime add table public.rental_agreements;
