import type { ProfileThemeId } from "@/lib/constants";
import type { SocialPlatformId } from "@/lib/constants";

/** Everything the profile card needs to render, independent of source. */
export interface ProfileCardData {
  name: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  provider: string;
  identifier: string;
  theme: ProfileThemeId;
  socialLinks: { platform: SocialPlatformId | string; url: string }[];
  settings: {
    show_qr: boolean;
    show_social_links: boolean;
    allow_custom_amount: boolean;
  };
}
