import pgCore = require("drizzle-orm/pg-core");
import profilesSchema = require("./profiles");

const { profiles } = profilesSchema;
const { index, pgTable, text, timestamp, uuid, bigserial } = pgCore;

const courses = pgTable(
  "courses",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    lecturerId: uuid("lecturer_id").references(() => profiles.id),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("courses_lecturer_id_idx").on(table.lecturerId),
    index("courses_name_idx").on(table.name),
  ],
);

export = { courses };
