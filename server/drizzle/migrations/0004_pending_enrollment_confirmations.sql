ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active';
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "confirmed_at" timestamp with time zone;
UPDATE "enrollments" SET "status" = 'active', "confirmed_at" = COALESCE("confirmed_at", "enrolled_at") WHERE "status" IS NULL OR "status" = 'active';
CREATE INDEX IF NOT EXISTS "enrollments_status_idx" ON "enrollments" USING btree ("status");
