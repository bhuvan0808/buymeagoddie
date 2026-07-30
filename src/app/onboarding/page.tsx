import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { GradientBlobs } from "@/components/shared/gradient-blobs";
import { Logo } from "@/components/shared/logo";
import { OnboardingWizard } from "@/features/onboarding/components/wizard";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Set up your page",
  robots: { index: false },
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.login);

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, avatar_url, onboarded")
    .eq("id", user.id)
    .single();

  if (profile?.onboarded) redirect(ROUTES.dashboard);

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <GradientBlobs intensity="subtle" />
      <header className="flex justify-center px-6 py-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16">
        <OnboardingWizard
          userId={user.id}
          initialName={profile?.name ?? ""}
          initialAvatarUrl={profile?.avatar_url ?? null}
        />
      </main>
    </div>
  );
}
