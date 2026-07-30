import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/features/profile/components/profile-card";
import { PROFILE_THEME_STYLES } from "@/features/profile/theme-styles";
import { getPublicProfile } from "@/features/profile/queries";
import { JsonLd, creatorProfileSchema } from "@/lib/seo/json-ld";
import { ROUTES } from "@/lib/constants";
import { siteConfig } from "@/lib/site";
import { absoluteUrl, cn } from "@/lib/utils";

type PageProps = { params: Promise<{ username: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const result = await getPublicProfile(username);
  // Bailing out here (before streaming starts) makes the response a real
  // HTTP 404 instead of a streamed 200 with not-found UI.
  if (!result) notFound();

  const { card } = result;
  const title = `Support ${card.name} (@${card.username})`;
  const description =
    card.bio ??
    `Support ${card.name} directly with UPI on ${siteConfig.name}. No fees, no middleman.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/${card.username}`) },
    openGraph: {
      type: "profile",
      title,
      description,
      url: absoluteUrl(`/${card.username}`),
      siteName: siteConfig.name,
      images: card.avatarUrl ? [{ url: card.avatarUrl }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: card.avatarUrl ? [card.avatarUrl] : undefined,
    },
  };
}

export default async function CreatorProfilePage({ params }: PageProps) {
  const { username } = await params;
  const result = await getPublicProfile(username);
  if (!result) notFound();

  const { card } = result;
  const themeStyle =
    PROFILE_THEME_STYLES[card.theme] ?? PROFILE_THEME_STYLES.midnight;

  return (
    <div
      className={cn(
        "relative flex min-h-svh flex-col items-center px-4 py-8",
        themeStyle.page,
      )}
    >
      <JsonLd
        data={creatorProfileSchema({
          name: card.name,
          username: card.username,
          bio: card.bio,
          avatarUrl: card.avatarUrl,
        })}
      />

      <main className="flex w-full flex-1 items-center justify-center py-8">
        <ProfileCard data={card} mode="live" />
      </main>

      <footer className="flex flex-col items-center gap-3 pb-4 pt-8">
        <p
          className={cn(
            "text-xs",
            themeStyle.dark ? "text-white/40" : "text-zinc-500",
          )}
        >
          Powered by
        </p>
        <Logo asLink={false} className={themeStyle.dark ? "text-white" : ""} />
        <Button
          variant={themeStyle.dark ? "outline" : "secondary"}
          size="sm"
          asChild
          className={themeStyle.dark ? "border-white/20 text-white hover:bg-white/10" : ""}
        >
          <Link href={ROUTES.signup}>Create your own page — free</Link>
        </Button>
      </footer>
    </div>
  );
}
