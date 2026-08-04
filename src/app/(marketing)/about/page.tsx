import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";
import { SocialIcon } from "@/features/profile/components/social-icons";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Why BuyMeAGoddie exists.",
};

export default function AboutPage() {
  return (
    <ContentPage title="About BuyMeAGoddie">
      <p>
        Every existing support platform sits between creators and their
        money — taking a cut, delaying payouts, and demanding payment
        gateway accounts that many independent creators can&apos;t easily
        get.
      </p>
      <p>
        Meanwhile, India built UPI: instant, free, universal. Your
        supporters already have it. You already have it. The only thing
        missing was a beautiful page to connect the two.
      </p>
      <p>
        <strong>BuyMeAGoddie is that page.</strong> We give creators a
        premium profile with one-tap payment links and QR codes. Money flows
        supporter → creator, always. We never touch it — by design, not just
        by promise.
      </p>
      <p>
        UPI is where we start, not where we stop. Pix in Brazil, PayNow in
        Singapore, PromptPay in Thailand, QRIS in Indonesia, SEPA Instant in
        Europe, Aani in the UAE — the world is moving to instant, free,
        direct payments, and creator pages should too.
      </p>
      <h2>The human behind it</h2>
      <p>
        BuyMeAGoddie is built and maintained by{" "}
        <strong>{siteConfig.maintainer.name}</strong> —{" "}
        {siteConfig.maintainer.role.toLowerCase()}. Every feature, every
        pixel, every commit: one person shipping for the creator community.
        That also means {siteConfig.maintainer.note.toLowerCase()}
      </p>
      <p className="flex flex-wrap gap-3">
        {siteConfig.maintainer.socials.map((social) => (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <SocialIcon platform={social.platform} className="size-4" />
            {social.label}
          </a>
        ))}
      </p>
      <h2>Part of the LinkYaar family</h2>
      <p>
        BuyMeAGoddie is a sister project of{" "}
        <a
          href="https://linkyaar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          LinkYaar
        </a>{" "}
        — the open-source link-in-bio platform (&quot;Everything you are. One
        beautiful link.&quot;). Same philosophy, same community: free,
        open-source tools that put creators first. Your LinkYaar page and
        your BuyMeAGoddie page are better together.
      </p>
    </ContentPage>
  );
}
