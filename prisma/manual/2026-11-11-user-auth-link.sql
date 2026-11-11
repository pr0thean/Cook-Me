-- Phase 0 (community posts): link users to Supabase auth by id and add approval fields.
--
-- Run once in the Supabase SQL editor BEFORE `npm run db:push`.
-- `db push` can't add the required `auth_id` column to a table that already has rows,
-- so this script adds it, backfills it from auth.users (matched by email), then makes it required.
-- Afterwards `npm run db:push` should report that the database is already in sync.
--
-- Optional preview — every row should have a non-null auth_id:
--   SELECT u.id, u.email, u.role, a.id AS auth_id
--   FROM public.users u LEFT JOIN auth.users a ON lower(a.email) = lower(u.email);

BEGIN;

CREATE TYPE "user_status" AS ENUM ('PENDING', 'APPROVED', 'BANNED');

ALTER TABLE "users"
  ADD COLUMN "auth_id" UUID,
  ADD COLUMN "status" "user_status" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "approved_at" TIMESTAMPTZ(6),
  ADD COLUMN "join_reason" TEXT,
  ADD COLUMN "last_seen_posts_at" TIMESTAMPTZ(6);

UPDATE "users" u
SET "auth_id" = a.id
FROM auth.users a
WHERE lower(a.email) = lower(u.email);

-- Accounts that existed before the approval flow (the admin) are approved.
UPDATE "users" SET "status" = 'APPROVED', "approved_at" = now();

-- Fails (and rolls back everything) if any row couldn't be matched to an auth user.
ALTER TABLE "users" ALTER COLUMN "auth_id" SET NOT NULL;

CREATE UNIQUE INDEX "users_auth_id_key" ON "users"("auth_id");

COMMIT;
