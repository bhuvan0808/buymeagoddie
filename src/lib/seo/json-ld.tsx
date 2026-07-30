import { FAQ_ITEMS } from "@/features/marketing/faq-data";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

/**
 * Renders a schema.org JSON-LD block. Content is generated exclusively from
 * our own typed structures — never from user-controlled strings without
 * JSON.stringify escaping (which this uses).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    sameAs: Object.values(siteConfig.links),
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function creatorProfileSchema(profile: {
  name: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      alternateName: `@${profile.username}`,
      description: profile.bio ?? undefined,
      image: profile.avatarUrl ?? undefined,
      url: absoluteUrl(`/${profile.username}`),
    },
  };
}
