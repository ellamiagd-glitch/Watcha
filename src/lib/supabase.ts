import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase browser client.
//
// The app currently runs on the seed data in `data.ts`, so Supabase is OPTIONAL
// until you add credentials. Once `.env.local` has your project URL + anon key
// (see `.env.local.example`), this returns a live client, and `data.ts` can be
// migrated query-by-query to read from the database instead of the seed arrays.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (see .env.local.example).",
    );
  }
  if (!client) {
    client = createClient(url!, anonKey!);
  }
  return client;
}
