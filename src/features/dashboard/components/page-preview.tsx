import { ProfileCard } from "@/features/profile/components/profile-card";
import { PROFILE_THEME_STYLES } from "@/features/profile/theme-styles";
import type { ProfileCardData } from "@/features/profile/types";
import type { ProfileThemeId } from "@/lib/constants";
import type { DashboardData } from "@/features/dashboard/queries";
import { cn } from "@/lib/utils";

/** Maps dashboard rows into the shape the shared profile card renders. */
export function toProfileCardData(data: DashboardData): ProfileCardData {
  return {
    name: data.profile.name,
    username: data.profile.username ?? "",
    bio: data.profile.bio,
    avatarUrl: data.profile.avatar_url,
    provider: data.profile.payment_method ?? "upi",
    identifier: data.profile.payment_identifier ?? "",
    theme: (data.profile.theme as ProfileThemeId) ?? "midnight",
    socialLinks: data.socialLinks.map((link) => ({
      platform: link.platform,
      url: link.url,
    })),
    settings: {
      show_qr: data.settings?.show_qr ?? true,
      show_social_links: data.settings?.show_social_links ?? true,
      allow_custom_amount: data.settings?.allow_custom_amount ?? true,
    },
  };
}

/** Live preview of the public page, framed like a phone. */
export function PagePreview({ data }: { data: DashboardData }) {
  const cardData = toProfileCardData(data);
  const themeStyle =
    PROFILE_THEME_STYLES[cardData.theme] ?? PROFILE_THEME_STYLES.midnight;

  return (
    <section aria-label="Page preview" className="lg:sticky lg:top-6">
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Live preview
      </p>
      <div
        className={cn(
          "flex justify-center rounded-[2.2rem] border border-border p-4 py-8 shadow-inner",
          themeStyle.page,
        )}
      >
        <ProfileCard data={cardData} mode="preview" />
      </div>
    </section>
  );
}
