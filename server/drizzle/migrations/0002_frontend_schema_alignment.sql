DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'profile_status') THEN
		CREATE TYPE "public"."profile_status" AS ENUM('active', 'pending_review', 'suspended');
	END IF;
END
$$;
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_severity') THEN
		CREATE TYPE "public"."activity_severity" AS ENUM('info', 'warning', 'critical');
	END IF;
END
$$;
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_category') THEN
		CREATE TYPE "public"."report_category" AS ENUM('moderation', 'billing', 'academic_integrity', 'operations');
	END IF;
END
$$;
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
		CREATE TYPE "public"."report_status" AS ENUM('open', 'in_review', 'resolved');
	END IF;
END
$$;
--> statement-breakpoint
ALTER TYPE "public"."attendance_status" ADD VALUE IF NOT EXISTS 'late';
--> statement-breakpoint
ALTER TYPE "public"."subscription_status" ADD VALUE IF NOT EXISTS 'trial';
--> statement-breakpoint
ALTER TYPE "public"."subscription_status" ADD VALUE IF NOT EXISTS 'past_due';
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "first_name" text;
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "last_name" text;
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "status" "public"."profile_status" DEFAULT 'active';
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "avatar_url" text;
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "phone_number" text;
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "address" text;
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "department" text;
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "batch" text;
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "class_year" integer;
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "academic_bio" text;
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "current_gpa" numeric(4, 2);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "earned_credits" integer;
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "last_seen_at" timestamp with time zone;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profiles_status_idx" ON "profiles" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profiles_department_idx" ON "profiles" USING btree ("department");
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "section" text;
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "subject" text;
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "room" text;
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "schedule" text;
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "semester" text;
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "program" text;
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active';
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "health_status" text DEFAULT 'healthy';
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "completion_rate" numeric(5, 2);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "courses_status_idx" ON "courses" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "courses_health_status_idx" ON "courses" USING btree ("health_status");
--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN IF NOT EXISTS "assignment_type" text DEFAULT 'assignment';
--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN IF NOT EXISTS "topic" text;
--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN IF NOT EXISTS "summary" text;
--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN IF NOT EXISTS "instructions" text[];
--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN IF NOT EXISTS "flagged_count" integer DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'on_track';
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "assignments_status_idx" ON "assignments" USING btree ("status");
--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN IF NOT EXISTS "description" text;
--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN IF NOT EXISTS "tag" text;
--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN IF NOT EXISTS "meta" text;
--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'submitted';
--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "submission_note" text;
--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "file_urls" text[];
--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "media_urls" text[];
--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "link_urls" text[];
--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "feedback" text;
--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "returned_at" timestamp with time zone;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submissions_status_idx" ON "submissions" USING btree ("status");
--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN IF NOT EXISTS "note" text;
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "billing_cycle" text;
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "mrr_usd" numeric(10, 2);
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "status_reason" text;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activity_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"actor_id" uuid,
	"actor_label" text,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"target_label" text,
	"severity" "public"."activity_severity" DEFAULT 'info',
	"details" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "activity_logs" DROP CONSTRAINT IF EXISTS "activity_logs_actor_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_logs_actor_id_idx" ON "activity_logs" USING btree ("actor_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_logs_severity_idx" ON "activity_logs" USING btree ("severity");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_logs_created_at_idx" ON "activity_logs" USING btree ("created_at");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"owner_id" uuid,
	"owner_label" text,
	"category" "public"."report_category" DEFAULT 'operations',
	"status" "public"."report_status" DEFAULT 'open',
	"summary" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"resolved_at" timestamp with time zone,
	"resolved_by" uuid
);
--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT IF EXISTS "reports_owner_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT IF EXISTS "reports_resolved_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_profiles_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_owner_id_idx" ON "reports" USING btree ("owner_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_status_idx" ON "reports" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_category_idx" ON "reports" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
