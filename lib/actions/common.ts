import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Verifies that the user is logged in, and returns either the service-role client
 * (if SUPABASE_SERVICE_ROLE_KEY is set) or the user's authenticated client.
 */
export async function getAuthenticatedSupabase() {
  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    return {
      supabase: null,
      user: null,
      error: "Anda belum login atau sesi telah berakhir. Silakan login di /login terlebih dahulu.",
    };
  }

  const adminClient = createAdminClient();
  return {
    supabase: adminClient ?? userClient,
    user,
    error: null,
  };
}
