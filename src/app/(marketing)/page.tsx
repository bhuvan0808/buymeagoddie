import { Cta } from "@/features/marketing/components/cta";
import { DemoProfile } from "@/features/marketing/components/demo-profile";
import { Faq } from "@/features/marketing/components/faq";
import { Features } from "@/features/marketing/components/features";
import { Hero } from "@/features/marketing/components/hero";
import { HowItWorks } from "@/features/marketing/components/how-it-works";
import { Pricing } from "@/features/marketing/components/pricing";
import { SocialProof } from "@/features/marketing/components/social-proof";
import {
  JsonLd,
  faqSchema,
  organizationSchema,
  webSiteSchema,
} from "@/lib/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema()} />
      <JsonLd data={faqSchema()} />

      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <DemoProfile />
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}
