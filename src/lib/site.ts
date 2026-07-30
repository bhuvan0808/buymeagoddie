/**
 * Central site configuration. Every user-facing string that identifies the
 * product lives here — no magic strings scattered through the codebase.
 */
export const siteConfig = {
  name: "BuyMeAGoddie",
  tagline: "Receive support directly with UPI.",
  description:
    "BuyMeAGoddie is a creator payment profile platform. Create a beautiful support page, add your UPI ID, and receive money directly from supporters — no payment gateway, no platform fees, no middleman.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://buymeagoddie.com",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/buymeagoddie",
    github: "https://github.com/bhuvan0808/buymeagoddie",
    instagram: "https://instagram.com/buymeagoddie",
    linkedin: "https://linkedin.com/company/buymeagoddie",
  },
  creatorHandleExample: "bhuvan",
} as const;

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  comingSoon?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Resources",
    items: [
      { label: "Help Center", href: "/help" },
      { label: "Documentation", href: "/docs", comingSoon: true },
      { label: "Feature Requests", href: "/feedback", comingSoon: true },
      { label: "QR Code", href: "/#features" },
      { label: "Stream Alerts", href: "/#features", comingSoon: true },
    ],
  },
  {
    title: "Comparisons",
    items: [
      { label: "Ko-fi", href: "/compare/ko-fi" },
      { label: "Patreon", href: "/compare/patreon" },
      { label: "Kickstarter", href: "/compare/kickstarter" },
      { label: "Ghost", href: "/compare/ghost" },
      { label: "Podia", href: "/compare/podia" },
      { label: "Gumroad", href: "/compare/gumroad" },
      { label: "Memberful", href: "/compare/memberful" },
      { label: "Teachable", href: "/compare/teachable" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
      { label: "Security", href: "/security" },
      { label: "Refund Policy", href: "/refunds" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "GitHub", href: siteConfig.links.github, external: true },
      { label: "Twitter", href: siteConfig.links.twitter, external: true },
      { label: "Instagram", href: siteConfig.links.instagram, external: true },
      { label: "LinkedIn", href: siteConfig.links.linkedin, external: true },
    ],
  },
];
