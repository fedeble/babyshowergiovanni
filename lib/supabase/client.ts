"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";
import type { Database } from "./database.types";

let browserClient: SupabaseClient<Database> | undefined;

export function createBrowserSupabaseClient() {
  if (!browserClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}
