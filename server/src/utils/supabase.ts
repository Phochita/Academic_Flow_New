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

const supabaseUrl = getRequiredEnv("SUPABASE_URL");
const supabaseAnonKey = getRequiredEnv("SUPABASE_ANON_KEY");
const supabaseServiceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

const createSupabaseClient = () => supabaseJs.createClient(supabaseUrl, supabaseAnonKey, clientOptions);
const supabaseAdmin = supabaseJs.createClient(supabaseUrl, supabaseServiceRoleKey, clientOptions);

export = { createSupabaseClient, supabaseAdmin };
