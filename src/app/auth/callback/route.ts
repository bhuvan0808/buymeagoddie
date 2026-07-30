import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles every email/OAuth round-trip: OAuth code exchange, magic links,
 * signup confirmations, and password recovery links.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  const supabase = await createClient();

  let authenticated = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authenticated = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    authenticated = !error;
  }

  if (!authenticated) {
    return NextResponse.redirect(
      `${origin}${ROUTES.login}?error=auth_failed`,
    );
  }

  // Only allow same-origin relative redirects.
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Route by onboarding state: new users build their page first.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", user.id)
      .single();
    if (!profile?.onboarded) {
      return NextResponse.redirect(`${origin}${ROUTES.onboarding}`);
    }
  }

  return NextResponse.redirect(`${origin}${ROUTES.dashboard}`);
}
