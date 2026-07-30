"use server";

import { revalidatePath } from "next/cache";

import { checkUsernameAvailability } from "@/features/onboarding/actions";
import { getPaymentMethod } from "@/features/payments/registry";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";
import {
  paymentSchema,
  profileSchema,
  settingsSchema,
  socialLinkSchema,
} from "@/lib/validation/profile";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function revalidateProfilePages(username: string) {
  revalidatePath(ROUTES.dashboard);
  revalidatePath(`/${username}`);
}

export async function updateProfile(input: unknown): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]!.message };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Session expired. Sign in again." };

  const { data: current } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (current?.username !== parsed.data.username) {
    const availability = await checkUsernameAvailability(parsed.data.username);
    if (!availability.available) {
      return { ok: false, error: availability.reason ?? "Username unavailable." };
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name: parsed.data.name,
      username: parsed.data.username,
      bio: parsed.data.bio || null,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "That username was just taken." };
    }
    return { ok: false, error: "Couldn't save. Try again." };
  }

  if (current?.username && current.username !== parsed.data.username) {
    revalidatePath(`/${current.username}`);
  }
  revalidateProfilePages(parsed.data.username);
  return { ok: true };
}

export async function updateAvatar(avatarUrl: string): Promise<ActionResult> {
  if (!avatarUrl.startsWith("https://") || avatarUrl.length > 500) {
    return { ok: false, error: "Invalid image URL." };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Session expired. Sign in again." };

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id)
    .select("username")
    .single();

  if (error) return { ok: false, error: "Couldn't update your photo." };
  if (profile?.username) revalidateProfilePages(profile.username);
  return { ok: true };
}

export async function updatePayment(input: unknown): Promise<ActionResult> {
  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]!.message };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Session expired. Sign in again." };

  const method = getPaymentMethod(parsed.data.provider)!;
  const identifier = parsed.data.identifier.trim();

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({ payment_method: method.id, payment_identifier: identifier })
    .eq("id", user.id)
    .select("username")
    .single();

  if (error) return { ok: false, error: "Couldn't update your payment ID." };

  await supabase
    .from("payment_methods")
    .delete()
    .eq("user_id", user.id)
    .eq("is_default", true);
  await supabase.from("payment_methods").insert({
    user_id: user.id,
    provider: method.id,
    identifier,
    country: method.country,
    is_default: true,
  });

  if (profile?.username) revalidateProfilePages(profile.username);
  return { ok: true };
}

export async function updateSettings(input: unknown): Promise<ActionResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]!.message };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Session expired. Sign in again." };

  const { error } = await supabase
    .from("settings")
    .update(parsed.data)
    .eq("user_id", user.id);
  if (error) return { ok: false, error: "Couldn't save settings." };

  // Theme is denormalized on the profile for one-query public page reads.
  const { data: profile } = await supabase
    .from("profiles")
    .update({ theme: parsed.data.theme })
    .eq("id", user.id)
    .select("username")
    .single();

  if (profile?.username) revalidateProfilePages(profile.username);
  return { ok: true };
}

export async function saveSocialLinks(input: unknown): Promise<ActionResult> {
  const links = Array.isArray(input) ? input : [];
  if (links.length > 6) {
    return { ok: false, error: "At most 6 links." };
  }
  const parsedLinks = [];
  for (const link of links) {
    const parsed = socialLinkSchema.safeParse(link);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]!.message };
    }
    parsedLinks.push(parsed.data);
  }
  const platforms = new Set(parsedLinks.map((link) => link.platform));
  if (platforms.size !== parsedLinks.length) {
    return { ok: false, error: "One link per platform." };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Session expired. Sign in again." };

  // Replace-all keeps ordering deterministic and deletion trivial.
  const { error: deleteError } = await supabase
    .from("social_links")
    .delete()
    .eq("user_id", user.id);
  if (deleteError) return { ok: false, error: "Couldn't save links." };

  if (parsedLinks.length > 0) {
    const { error: insertError } = await supabase.from("social_links").insert(
      parsedLinks.map((link, index) => ({
        user_id: user.id,
        platform: link.platform,
        url: link.url,
        position: index,
      })),
    );
    if (insertError) return { ok: false, error: "Couldn't save links." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  if (profile?.username) revalidateProfilePages(profile.username);
  return { ok: true };
}
