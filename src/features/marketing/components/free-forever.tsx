import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";

/**
 * Replaces a pricing table entirely: there is nothing to price.
 */
export function FreeForever() {
  return (
    <section aria-label="Free forever" className="relative py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="glass-card glow-ring flex flex-col items-center gap-4 rounded-3xl px-8 py-12 text-center">
            <Badge variant="gold">Free forever</Badge>
            <h2 className="text-3xl font-bold sm:text-5xl">
              ₹0. No fees. <span className="text-gradient">No catch.</span>
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Payments go straight from your supporters to your bank over UPI
              — there is no point in the flow where we could take a cut.
              BuyMeAGoddie is free today, free at a million creators, free
              forever.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
