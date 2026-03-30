CREATE TABLE "materials" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"course_id" bigint,
	"title" text NOT NULL,
	"type" text,
	"url" text NOT NULL,
	"uploaded_by" uuid,
	"uploaded_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_uploaded_by_profiles_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "materials_course_id_idx" ON "materials" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "materials_uploaded_by_idx" ON "materials" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "materials_type_idx" ON "materials" USING btree ("type");