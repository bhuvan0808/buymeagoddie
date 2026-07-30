"use server";

import { revalidatePath } from "next/cache";

import { getPaymentMethod } from "@/features/payments/registry";
import { createClient } from "@/lib/supabase/server";
import { RESERVED_USERNAMES } from "@/lib/constants";
import {
  paymentSchema,
  profileSchema,
  usernameSchema,
} from "@/lib/validation/profile";

export type OnboardingResult =
  | { ok: true; username: string }
  | { ok: false; error: string };

/** Fast availability probe used by the wizard's live username check. */
export async function checkUsernameAvailability(
  username: string,
): Promise<{ available: boolean; reason?: string }> {
  const parsed = usernameSchema.safeParse(username);
  if (!parsed.success) {
    return { available: false, reason: parsed.error.issues[0]!.message };
  }
  if (RESERVED_USERNAMES.has(parsed.data)) {
    return { available: false, reason: "That username is reserved." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_username_available", {
    candidate: parsed.data,
  });
  if (error) {
    return { available: false, reason: "Couldn't check availability. Try again." };
  }
  return data
    ? { available: true }
    : { available: false, reason: "That username is taken." };
}

/**
 * Persists the whole wizard in one transaction-ish sequence: profile fields,
 * default payment method, onboarded flag.
 */
export async function completeOnboarding(
  input: unknown,
): Promise<OnboardingResult> {
  const wizardData = input as {
    country?: string;
    name?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string | null;
    provider?: string;
    identifier?: string;
  };

  if (wizardData.country !== "IN") {
    return { ok: false, error: "Only India is supported right now." };
  }

  const profileParsed = profileSchema.safeParse(wizardData);
  if (!profileParsed.success) {
    return { ok: false, error: profileParsed.error.issues[0]!.message };
  }

  const paymentParsed = paymentSchema.safeParse(wizardData);
  if (!paymentParsed.success) {
    return { ok: false, error: paymentParsed.error.issues[0]!.message };
  }

  const method = getPaymentMethod(paymentParsed.data.provider)!;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Your session expired. Sign in again." };
  }

  const availability = await checkUsernameAvailability(
    profileParsed.data.username,
  );
  // The user keeps their own username on re-runs of onboarding.
  const { data: existing } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  if (!availability.available && existing?.username !== profileParsed.data.username) {
    return { ok: false, error: availability.reason ?? "Username unavailable." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      name: profileParsed.data.name,
      username: profileParsed.data.username,
      bio: profileParsed.data.bio || null,
      country: wizardData.country,
      avatar_url: wizardData.avatarUrl ?? null,
      payment_method: method.id,
      payment_identifier: paymentParsed.data.identifier.trim(),
      onboarded: true,
    })
    .eq("id", user.id);

  if (profileError) {
    if (profileError.code === "23505") {
      return { ok: false, error: "That username was just taken. Pick another." };
    }
    return { ok: false, error: "Couldn't save your profile. Try again." };
  }

  // Upsert the default payment method row (generic rail storage).
  await supabase
    .from("payment_methods")
    .delete()
    .eq("user_id", user.id)
    .eq("is_default", true);
  const { error: paymentError } = await supabase.from("payment_methods").insert({
    user_id: user.id,
    provider: method.id,
    identifier: paymentParsed.data.identifier.trim(),
    country: method.country,
    is_default: true,
  });
  if (paymentError) {
    return { ok: false, error: "Couldn't save your payment method. Try again." };
  }

  revalidatePath(`/${profileParsed.data.username}`);
  return { ok: true, username: profileParsed.data.username };
}
