import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * Supabase admin client using service_role key.
 * Only use server-side (API routes, Server Actions, Server Components).
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error("Missing Supabase URL or service role key");
  }
  return createAdminClient(url, key, {
    auth: { persistSession: false },
  });
}
