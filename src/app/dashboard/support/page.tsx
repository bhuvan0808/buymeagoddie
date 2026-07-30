import { ProfileCard } from "@/features/profile/components/profile-card";
import type { ProfileCardData } from "@/features/profile/types";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Support BuyMeAGoddie" };

/**
 * We use our own product to accept support — the strongest dogfooding
 * statement a zero-fee platform can make.
 */
const PLATFORM_PROFILE: ProfileCardData = {
  name: "BuyMeAGoddie",
  username: "buymeagoddie",
  bio: "We take zero fees, so the servers run on goodwill (and goddies). If the platform helps you, consider fueling it 💜",
  avatarUrl: null,
  provider: "upi",
  identifier: siteConfig.supportUpiId,
  theme: "midnight",
  socialLinks: [
    { platform: "twitter", url: "https://x.com/buymeagoddie" },
    { platform: "github", url: "https://github.com/buymeagoddie" },
  ],
  settings: {
    show_qr: true,
    show_social_links: true,
    allow_custom_amount: true,
  },
};

export default function SupportPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold">Support BuyMeAGoddie</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          100% optional. 100% appreciated. Paid the same way you get paid —
          directly, over UPI.
        </p>
      </div>
      <ProfileCard data={PLATFORM_PROFILE} mode="live" />
    </div>
  );
}
