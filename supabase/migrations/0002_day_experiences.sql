-- Add the experiential-content column to days.
-- Additive, nullable, no data loss. The generic camelCase<->snake_case mapping
-- in src/lib/data/mapping.ts carries this column with no entities.ts change.
-- Run AFTER 0001_init.sql.

alter table public.days add column if not exists experiences jsonb;
