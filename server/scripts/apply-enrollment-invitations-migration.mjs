import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config();

const connectionString = process.env.DRIZZLE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DRIZZLE_DATABASE_URL or DATABASE_URL.");
}

const sql = postgres(connectionString, { max: 1 });

const statements = [
  `ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active'`,
  `ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "confirmed_at" timestamp with time zone`,
  `UPDATE "enrollments"
   SET "status" = 'active',
       "confirmed_at" = COALESCE("confirmed_at", "enrolled_at")
   WHERE "status" IS NULL OR "status" = 'active'`,
  `CREATE INDEX IF NOT EXISTS "enrollments_status_idx" ON "enrollments" USING btree ("status")`,
];

try {
  for (const statement of statements) {
    await sql.unsafe(statement);
  }

  const columns = await sql`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'enrollments'
      and column_name in ('status', 'confirmed_at')
    order by column_name
  `;

  console.log(`Enrollment invitation columns: ${columns.map((row) => row.column_name).join(", ")}`);
} finally {
  await sql.end();
}
