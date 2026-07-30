import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Lightweight Supabase ping, hit daily by Vercel Cron (see vercel.json).
 * Free-tier Supabase projects are paused after ~7 days without API
 * activity — this guarantees the project always counts as active.
 */
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, profiles: count ?? 0 });
}
