import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Admin client using the secret (service) key. SERVER ONLY — importing this
 * from client code would leak the key; the runtime guard below makes that
 * failure loud instead of silent.
 *
 * Used to auto-confirm email signups so users can log in immediately
 * without an email round-trip (no domain/custom SMTP yet). When a custom
 * domain + branded SMTP exist, switch back to confirmation emails by
 * removing SUPABASE_SECRET_KEY-based signup in features/auth/actions.ts.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient must never run in the browser.");
  }
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) return null;

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secretKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
