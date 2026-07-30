import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { ProfileThemeId } from "@/lib/constants";
import type { ProfileCardData } from "@/features/profile/types";

const USERNAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PublicProfileResult = {
  card: ProfileCardData;
  createdAt: string;
} | null;

/**
 * Loads a creator's public page data. Returns null for unknown, invalid, or
 * not-yet-onboarded usernames so the route can 404.
 */
export const getPublicProfile = cache(
  async (username: string): Promise<PublicProfileResult> => {
    const normalized = username.toLowerCase();
    if (!USERNAME_PATTERN.test(normalized) || normalized.length > 30) {
      return null;
    }

    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, name, username, bio, avatar_url, payment_method, payment_identifier, theme, onboarded, created_at",
      )
      .eq("username", normalized)
      .single();

    if (
      !profile ||
      !profile.onboarded ||
      !profile.payment_method ||
      !profile.payment_identifier
    ) {
      return null;
    }

    const [{ data: socialLinks }, { data: settings }] = await Promise.all([
      supabase
        .from("social_links")
        .select("platform, url")
        .eq("user_id", profile.id)
        .order("position"),
      supabase
        .from("settings")
        .select("show_qr, show_social_links, allow_custom_amount")
        .eq("user_id", profile.id)
        .single(),
    ]);

    return {
      card: {
        name: profile.name,
        username: profile.username!,
        bio: profile.bio,
        avatarUrl: profile.avatar_url,
        provider: profile.payment_method,
        identifier: profile.payment_identifier,
        theme: (profile.theme as ProfileThemeId) ?? "midnight",
        socialLinks: socialLinks ?? [],
        settings: settings ?? {
          show_qr: true,
          show_social_links: true,
          allow_custom_amount: true,
        },
      },
      createdAt: profile.created_at,
    };
  },
);
