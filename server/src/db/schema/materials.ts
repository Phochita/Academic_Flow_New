import pgCore = require("drizzle-orm/pg-core");
import coursesSchema = require("./courses");
import profilesSchema = require("./profiles");

const { courses } = coursesSchema;
const { profiles } = profilesSchema;
const { bigint, bigserial, index, pgTable, text, timestamp, uuid } = pgCore;

const materials = pgTable(
  "materials",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    courseId: bigint("course_id", { mode: "number" }).references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    type: text("type"),
    url: text("url").notNull(),
    uploadedBy: uuid("uploaded_by").references(() => profiles.id),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("materials_course_id_idx").on(table.courseId),
    index("materials_uploaded_by_idx").on(table.uploadedBy),
    index("materials_type_idx").on(table.type),
  ],
);

export = { materials };
