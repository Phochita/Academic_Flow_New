import dotenv = require("dotenv");
import drizzleKit = require("drizzle-kit");
import path = require("node:path");
import process = require("node:process");

const serverRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.resolve(serverRoot, ".env") });

const schemaPath = path
  .relative(process.cwd(), path.resolve(serverRoot, "src/db/schema/*.ts"))
  .replace(/\\/g, "/");
const migrationsPath = path
  .relative(process.cwd(), path.resolve(serverRoot, "drizzle/migrations"))
  .replace(/\\/g, "/");

const databaseUrl =
  process.env.DRIZZLE_DATABASE_URL?.trim() ||
  process.env.DIRECT_URL?.trim() ||
  process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("Missing DRIZZLE_DATABASE_URL, DIRECT_URL, or DATABASE_URL environment variable for Drizzle config.");
}

export = drizzleKit.defineConfig({
  schema: schemaPath,
  out: migrationsPath,
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    url: databaseUrl,
  },
});
