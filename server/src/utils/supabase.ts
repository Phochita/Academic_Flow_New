import dotenv = require("dotenv");
import path = require("node:path");
import process = require("node:process");
import supabaseJs = require("@supabase/supabase-js");

const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });

const envFallbacks = {
  SUPABASE_URL: ["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"],
  SUPABASE_ANON_KEY: ["SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
  SUPABASE_SERVICE_ROLE_KEY: ["SUPABASE_SERVICE_ROLE_KEY"],
} as const;

const getRequiredEnv = (name: keyof typeof envFallbacks) => {
  const value = envFallbacks[name]
    .map((key) => process.env[key]?.trim())
    .find((candidate) => Boolean(candidate));

  if (!value) {
    throw new Error(`Missing ${envFallbacks[name].join(" or ")} environment variable.`);
  }

  return value;
};

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

let cachedSupabaseAdmin: ReturnType<typeof supabaseJs.createClient> | null = null;

const getSupabaseConfig = () => ({
  anonKey: getRequiredEnv("SUPABASE_ANON_KEY"),
  serviceRoleKey: getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  url: getRequiredEnv("SUPABASE_URL"),
});

const createSupabaseClient = () => {
  const config = getSupabaseConfig();

  return supabaseJs.createClient(config.url, config.anonKey, clientOptions);
};

const getSupabaseAdmin = () => {
  if (!cachedSupabaseAdmin) {
    const config = getSupabaseConfig();
    cachedSupabaseAdmin = supabaseJs.createClient(config.url, config.serviceRoleKey, clientOptions);
  }

  return cachedSupabaseAdmin;
};

const supabaseAdmin = new Proxy({} as ReturnType<typeof supabaseJs.createClient>, {
  get(_target, prop) {
    const target = getSupabaseAdmin();
    const value = Reflect.get(target, prop);

    return typeof value === "function" ? value.bind(target) : value;
  },
});

export = { createSupabaseClient, getSupabaseAdmin, supabaseAdmin };
