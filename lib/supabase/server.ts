import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";
import type { Database } from "./database.types";

export function createServerSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
