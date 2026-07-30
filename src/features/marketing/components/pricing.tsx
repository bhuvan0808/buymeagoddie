import Link from "next/link";
import { Check } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

const INCLUDED = [
  "Your own buymeagoddie.com/username page",
  "One-click UPI payments & QR codes",
  "Unlimited supporters, zero platform fees",
  "Themes, social links & custom branding",
  "Analytics & goals when they launch",
];

export function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title={
            <>
              Free. <span className="text-gradient">Actually free.</span>
            </>
          }
          description="We can't take a cut even if we wanted to — the money never passes through us."
        />

        <Reveal className="mx-auto mt-12 max-w-lg" delay={0.1}>
          <div className="glass-card glow-ring relative overflow-hidden rounded-3xl p-8 text-center sm:p-10">
            <Badge variant="gold" className="mx-auto mb-4">
              Creator plan
            </Badge>
            <div className="mb-1 font-display text-6xl font-extrabold">
              ₹0
            </div>
            <p className="mb-8 text-sm text-muted-foreground">
              forever · no card required · no transaction fees
            </p>
            <ul className="mb-8 flex flex-col gap-3 text-left">
              {INCLUDED.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm">
                  <span className="bg-gradient-brand mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <Button variant="gradient" size="lg" className="w-full" asChild>
              <Link href={ROUTES.signup}>Claim your page</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
