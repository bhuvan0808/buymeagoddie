"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";
import {
  forgotPasswordSchema,
  loginSchema,
  magicLinkSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/validation/auth";

export type AuthActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

async function getOrigin(): Promise<string> {
  const headerList = await headers();
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${headerList.get("host") ?? "localhost:3000"}`
  );
}

export async function signInWithPassword(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]!.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { ok: false, error: "Invalid email or password." };
  }
  redirect(ROUTES.dashboard);
}

export async function signUpWithPassword(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]!.message };
  }

  const supabase = await createClient();

  // Auto-confirm signups: create the user pre-verified via the admin API,
  // then sign them in immediately. No email round-trip until the project
  // has a custom domain + branded SMTP for confirmation emails.
  const admin = createAdminClient();
  if (admin) {
    const { error: createError } = await admin.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
    });
    if (createError) {
      const alreadyExists =
        createError.code === "email_exists" ||
        /already.*(registered|exists)/i.test(createError.message);
      return {
        ok: false,
        error: alreadyExists
          ? "That email already has an account — try signing in instead."
          : "Couldn't create your account. Try again.",
      };
    }
    const { error: signInError } = await supabase.auth.signInWithPassword(
      parsed.data,
    );
    if (signInError) {
      return { ok: false, error: "Account created — sign in to continue." };
    }
    redirect(ROUTES.onboarding);
  }

  // Fallback (no secret key configured): standard email-confirmation flow.
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { emailRedirectTo: `${origin}${ROUTES.authCallback}` },
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  if (data.session) {
    redirect(ROUTES.onboarding);
  }
  return {
    ok: true,
    message: "Check your inbox — we sent you a verification link.",
  };
}

export async function sendMagicLink(input: unknown): Promise<AuthActionResult> {
  const parsed = magicLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]!.message };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${origin}${ROUTES.authCallback}` },
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, message: "Magic link sent — check your inbox." };
}

export async function sendPasswordReset(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]!.message };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: `${origin}${ROUTES.authCallback}?next=/reset-password` },
  );
  if (error) {
    return { ok: false, error: error.message };
  }
  return {
    ok: true,
    message: "If that email has an account, a reset link is on its way.",
  };
}

export async function updatePassword(input: unknown): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]!.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  redirect(ROUTES.dashboard);
}

export async function signInWithGoogle(): Promise<AuthActionResult> {
  const origin = await getOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}${ROUTES.authCallback}`,
    },
  });
  if (error || !data.url) {
    return { ok: false, error: "Couldn't start Google sign-in. Try again." };
  }
  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ROUTES.home);
}
