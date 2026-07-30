import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GradientBlobs } from "@/components/shared/gradient-blobs";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export function Cta() {
  return (
    <section className="relative overflow-hidden py-28">
      <GradientBlobs />
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Your supporters are ready.
            <br />
            <span className="text-gradient">Give them a page.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Claim your username before someone else does. Free forever, live
            in under a minute.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="gradient" size="xl" asChild>
              <Link href={ROUTES.signup}>
                Create Your Page
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/#demo">See Demo First</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
