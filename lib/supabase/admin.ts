import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client with Service Role privileges.
 * ONLY use in Server Actions / Route Handlers (never in client components).
 * Bypasses RLS to guarantee administrative writes succeed when an admin is authenticated.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
