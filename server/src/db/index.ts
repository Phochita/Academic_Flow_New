import dotenv = require("dotenv");
import drizzleOrm = require("drizzle-orm/postgres-js");
import path = require("node:path");
import postgres = require("postgres");
import process = require("node:process");
import schema = require("./schema");

const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

// Supabase pooler connections can reject prepared statements, so keep them off here.
const sql = postgres(databaseUrl, { prepare: false });
const db = drizzleOrm.drizzle(sql, { schema });

export = { sql, db };
