import {
  BadgeIndianRupee,
  BarChart3,
  Goal,
  Package,
  Palette,
  QrCode,
  Share2,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/features/profile/components/social-icons";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  comingSoon?: boolean;
  future?: boolean;
  /** Bento sizing */
  wide?: boolean;
};

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "One-click UPI payments",
    description:
      "Supporters tap an amount and their UPI app opens with everything pre-filled. No signup, no checkout, no friction.",
    wide: true,
  },
  {
    icon: BadgeIndianRupee,
    title: "No platform transaction fees",
    description:
      "100% of every payment lands in your bank account. We never sit in the money flow.",
  },
  {
    icon: Sparkles,
    title: "Beautiful cards",
    description:
      "Your page looks hand-crafted — glass surfaces, gradient lighting, and smooth motion out of the box.",
  },
  {
    icon: QrCode,
    title: "QR codes",
    description:
      "Auto-generated payment QR for streams, posters, and desktop supporters.",
  },
  {
    icon: Palette,
    title: "Themes & custom branding",
    description:
      "Pick a theme that matches your vibe. Midnight, Aurora, Sunset, Daylight.",
  },
  {
    icon: Share2,
    title: "Share anywhere",
    description:
      "One link that works on Instagram, LinkedIn, YouTube, GitHub — anywhere you can paste.",
    wide: true,
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "See visits and supporter trends over time.",
    comingSoon: true,
  },
  {
    icon: Goal,
    title: "Goals",
    description: "Set a target and let supporters push the bar forward.",
    comingSoon: true,
  },
  {
    icon: Package,
    title: "Digital products",
    description: "Sell downloads directly from your page.",
    future: true,
  },
  {
    icon: Users,
    title: "Memberships",
    description: "Recurring support from your biggest fans.",
    future: true,
  },
];

const PLATFORM_ICONS = [InstagramIcon, LinkedinIcon, YoutubeIcon, GithubIcon];

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24">
      <div className="bg-grid-faint absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              Everything you need.{" "}
              <span className="text-gradient">Nothing in your way.</span>
            </>
          }
          description="A support page that feels premium, loads instantly, and gets out of the way of the payment."
        />

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(
            ({ icon: Icon, title, description, comingSoon, future, wide }) => (
              <RevealItem
                key={title}
                className={cn(wide && "sm:col-span-2")}
              >
                <article className="glass-card group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:glow-ring">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    {comingSoon ? (
                      <Badge variant="soon">Coming Soon</Badge>
                    ) : null}
                    {future ? <Badge variant="soon">Future</Badge> : null}
                  </div>
                  <h3 className="mb-1.5 font-display text-base font-semibold">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                  {title === "Share anywhere" ? (
                    <div className="mt-4 flex gap-2">
                      {PLATFORM_ICONS.map((PlatformIcon, index) => (
                        <span
                          key={index}
                          className="flex size-8 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground"
                        >
                          <PlatformIcon className="size-4" />
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              </RevealItem>
            ),
          )}
        </RevealGroup>
      </div>
    </section>
  );
}
