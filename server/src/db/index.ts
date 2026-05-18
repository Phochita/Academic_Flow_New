import dotenv = require("dotenv");
import drizzleOrm = require("drizzle-orm/postgres-js");
import path = require("node:path");
import postgres = require("postgres");
import process = require("node:process");
import schema = require("./schema");

const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });

let cachedSql: ReturnType<typeof postgres> | null = null;
let cachedDb: ReturnType<typeof drizzleOrm.drizzle> | null = null;

const getDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL environment variable.");
  }

  return databaseUrl;
};

const getSql = () => {
  if (!cachedSql) {
    // Supabase pooler connections can reject prepared statements, so keep them off here.
    cachedSql = postgres(getDatabaseUrl(), { prepare: false });
  }

  return cachedSql;
};

const getDb = () => {
  if (!cachedDb) {
    cachedDb = drizzleOrm.drizzle(getSql(), { schema });
  }

  return cachedDb;
};

const lazyProxy = <T extends object>(getTarget: () => T) =>
  new Proxy({} as T, {
    get(_target, prop) {
      const target = getTarget();
      const value = Reflect.get(target, prop);

      return typeof value === "function" ? value.bind(target) : value;
    },
  });

const sql = lazyProxy(getSql);
const db = lazyProxy(getDb);

export = { sql, db, getDb, getSql };
