import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";
import type {
  ProfileRow,
  SettingsRow,
  SocialLinkRow,
} from "@/types/database";

export type DashboardData = {
  profile: ProfileRow;
  socialLinks: SocialLinkRow[];
  settings: SettingsRow | null;
};

/**
 * Loads everything dashboard pages need. Cached per-request so layout and
 * page can both call it with a single set of queries.
 */
export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.login);

  const [{ data: profile }, { data: socialLinks }, { data: settings }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("social_links")
        .select("*")
        .eq("user_id", user.id)
        .order("position"),
      supabase.from("settings").select("*").eq("user_id", user.id).single(),
    ]);

  if (!profile) redirect(ROUTES.login);
  if (!profile.onboarded) redirect(ROUTES.onboarding);

  return {
    profile,
    socialLinks: socialLinks ?? [],
    settings: settings ?? null,
  };
});
