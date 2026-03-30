CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent');--> statement-breakpoint
CREATE TYPE "public"."profile_role" AS ENUM('student', 'lecturer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'expired', 'cancelled');--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"course_id" bigint,
	"title" text NOT NULL,
	"description" text,
	"due_date" timestamp with time zone NOT NULL,
	"max_score" numeric(5, 2),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"course_id" bigint,
	"student_id" uuid,
	"date" date NOT NULL,
	"status" "attendance_status",
	"marked_by" uuid,
	"marked_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"lecturer_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "courses_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"course_id" bigint,
	"student_id" uuid,
	"enrolled_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"full_name" text,
	"role" "profile_role" DEFAULT 'student',
	"is_pro" boolean DEFAULT false,
	"stripe_customer_id" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"assignment_id" bigint,
	"student_id" uuid,
	"submission_text" text,
	"file_url" text,
	"submitted_at" timestamp with time zone DEFAULT now(),
	"grade" numeric(5, 2),
	"graded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"plan" text,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"stripe_subscription_id" text,
	"status" "subscription_status" DEFAULT 'active',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_profiles_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_marked_by_profiles_id_fk" FOREIGN KEY ("marked_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_lecturer_id_profiles_id_fk" FOREIGN KEY ("lecturer_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_profiles_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_auth_user_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_student_id_profiles_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assignments_course_id_idx" ON "assignments" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "assignments_due_date_idx" ON "assignments" USING btree ("due_date");--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_course_student_date_uidx" ON "attendance" USING btree ("course_id","student_id","date");--> statement-breakpoint
CREATE INDEX "attendance_course_id_idx" ON "attendance" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "attendance_student_id_idx" ON "attendance" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "attendance_marked_by_idx" ON "attendance" USING btree ("marked_by");--> statement-breakpoint
CREATE INDEX "attendance_date_idx" ON "attendance" USING btree ("date");--> statement-breakpoint
CREATE INDEX "courses_lecturer_id_idx" ON "courses" USING btree ("lecturer_id");--> statement-breakpoint
CREATE INDEX "courses_name_idx" ON "courses" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollments_course_student_uidx" ON "enrollments" USING btree ("course_id","student_id");--> statement-breakpoint
CREATE INDEX "enrollments_course_id_idx" ON "enrollments" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "enrollments_student_id_idx" ON "enrollments" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "profiles_role_idx" ON "profiles" USING btree ("role");--> statement-breakpoint
CREATE INDEX "profiles_stripe_customer_id_idx" ON "profiles" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "submissions_assignment_student_uidx" ON "submissions" USING btree ("assignment_id","student_id");--> statement-breakpoint
CREATE INDEX "submissions_assignment_id_idx" ON "submissions" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "submissions_student_id_idx" ON "submissions" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "subscriptions_stripe_subscription_id_idx" ON "subscriptions" USING btree ("stripe_subscription_id");