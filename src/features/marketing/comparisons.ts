/**
 * Comparison page content. Honest, factual framing: we win on fees and
 * directness; alternatives win on features we haven't shipped yet.
 */
export type Comparison = {
  slug: string;
  competitor: string;
  summary: string;
  rows: { dimension: string; us: string; them: string }[];
};

const SHARED_ROWS = {
  fees: { dimension: "Platform fees", us: "0% — payments never touch us" },
  payout: {
    dimension: "Payout speed",
    us: "Instant — money lands directly in your bank via UPI",
  },
  gateway: {
    dimension: "Payment gateway required",
    us: "None — your UPI ID is enough",
  },
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "ko-fi",
    competitor: "Ko-fi",
    summary:
      "Ko-fi is a great global tipping platform. For creators in India, BuyMeAGoddie removes the PayPal/Stripe dependency entirely.",
    rows: [
      { ...SHARED_ROWS.fees, them: "0% on donations; 5% on memberships/shop" },
      { ...SHARED_ROWS.payout, them: "Via PayPal or Stripe — days, plus FX fees" },
      { ...SHARED_ROWS.gateway, them: "PayPal or Stripe account required" },
      {
        dimension: "Memberships & shop",
        us: "On the roadmap",
        them: "Available today",
      },
    ],
  },
  {
    slug: "patreon",
    competitor: "Patreon",
    summary:
      "Patreon is built for recurring membership businesses. BuyMeAGoddie is built for direct, one-tap support with zero fees.",
    rows: [
      { ...SHARED_ROWS.fees, them: "8–12% of your earnings" },
      { ...SHARED_ROWS.payout, them: "Monthly payout cycles" },
      { ...SHARED_ROWS.gateway, them: "Handled by Patreon (fees baked in)" },
      {
        dimension: "Membership tiers",
        us: "On the roadmap",
        them: "Core feature",
      },
    ],
  },
  {
    slug: "kickstarter",
    competitor: "Kickstarter",
    summary:
      "Kickstarter funds one-off projects with all-or-nothing campaigns. BuyMeAGoddie is ongoing support with no campaign mechanics.",
    rows: [
      { ...SHARED_ROWS.fees, them: "5% + payment processing fees" },
      { ...SHARED_ROWS.payout, them: "After campaign ends, if funded" },
      {
        dimension: "Model",
        us: "Ongoing direct support",
        them: "All-or-nothing project campaigns",
      },
    ],
  },
  {
    slug: "ghost",
    competitor: "Ghost",
    summary:
      "Ghost is a full publishing platform with paid newsletters. BuyMeAGoddie is a lightweight support page you set up in a minute.",
    rows: [
      { ...SHARED_ROWS.fees, them: "0% platform fee, but Stripe fees apply" },
      { ...SHARED_ROWS.gateway, them: "Stripe required" },
      {
        dimension: "Publishing & newsletters",
        us: "Not our focus",
        them: "Core feature",
      },
    ],
  },
  {
    slug: "podia",
    competitor: "Podia",
    summary:
      "Podia sells courses and digital products. BuyMeAGoddie handles direct support — digital products are on our roadmap.",
    rows: [
      { ...SHARED_ROWS.fees, them: "Paid plans + payment processing" },
      { ...SHARED_ROWS.gateway, them: "Stripe or PayPal required" },
      {
        dimension: "Courses & products",
        us: "Products on the roadmap",
        them: "Core feature",
      },
    ],
  },
  {
    slug: "gumroad",
    competitor: "Gumroad",
    summary:
      "Gumroad is a storefront for digital goods. BuyMeAGoddie is a zero-fee support page — no checkout, no cart.",
    rows: [
      { ...SHARED_ROWS.fees, them: "10% + processing on every sale" },
      { ...SHARED_ROWS.payout, them: "Weekly payouts, minimum thresholds" },
      { ...SHARED_ROWS.gateway, them: "Built-in (fees baked in)" },
    ],
  },
  {
    slug: "memberful",
    competitor: "Memberful",
    summary:
      "Memberful powers memberships for established publishers. BuyMeAGoddie is instant, fee-free direct support.",
    rows: [
      { ...SHARED_ROWS.fees, them: "4.9% + Stripe fees + monthly plan" },
      { ...SHARED_ROWS.gateway, them: "Stripe required" },
      {
        dimension: "Memberships",
        us: "On the roadmap",
        them: "Core feature",
      },
    ],
  },
  {
    slug: "teachable",
    competitor: "Teachable",
    summary:
      "Teachable is a course platform. BuyMeAGoddie is a support page — different jobs; ours is free and instant.",
    rows: [
      { ...SHARED_ROWS.fees, them: "Paid plans + transaction fees on lower tiers" },
      { ...SHARED_ROWS.gateway, them: "Built-in payments (fees apply)" },
      {
        dimension: "Course hosting",
        us: "Not our focus",
        them: "Core feature",
      },
    ],
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((comparison) => comparison.slug === slug);
}
