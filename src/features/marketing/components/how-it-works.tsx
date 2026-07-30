import { AtSign, Share2, UserRound } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";

const STEPS = [
  {
    icon: UserRound,
    step: "01",
    title: "Create Profile",
    description:
      "Sign up and claim your username. Add your name, bio, and photo — it takes seconds.",
  },
  {
    icon: AtSign,
    step: "02",
    title: "Add UPI ID",
    description:
      "Enter the UPI ID you already use — like bhuvan@okhdfcbank. We generate your QR code automatically.",
  },
  {
    icon: Share2,
    step: "03",
    title: "Share Your Link",
    description:
      "Drop buymeagoddie.com/you in your bio. Supporters tap an amount and pay you directly from their UPI app.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Three steps. <span className="text-gradient">Zero friction.</span>
            </>
          }
          description="No payment gateway onboarding, no KYC forms, no waiting for payouts. Your money never stops anywhere in between."
        />

        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, step, title, description }, index) => (
            <RevealItem key={step} className="relative">
              <article className="glass-card group relative h-full overflow-hidden rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1.5">
                <span
                  aria-hidden
                  className="absolute -right-3 -top-6 font-display text-8xl font-extrabold text-foreground/[0.04] transition-colors duration-300 group-hover:text-primary/10"
                >
                  {step}
                </span>
                <div className="bg-gradient-brand mb-6 inline-flex size-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-brand-violet/30">
                  <Icon className="size-6" aria-hidden />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
                {index < STEPS.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute -right-5 top-1/2 hidden -translate-y-1/2 text-2xl text-muted-foreground/40 md:block"
                  >
                    →
                  </span>
                ) : null}
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
