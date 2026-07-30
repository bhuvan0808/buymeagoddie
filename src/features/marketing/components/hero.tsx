"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, IndianRupee, ShieldCheck, Zap } from "lucide-react";

import { GradientBlobs } from "@/components/shared/gradient-blobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

// Three.js only ever loads in the browser, after hydration.
const HeroScene = dynamic(
  () =>
    import("@/components/three/hero-scene").then((mod) => mod.HeroScene),
  { ssr: false },
);

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative flex min-h-[92svh] items-center overflow-hidden pt-16"
      aria-label="Hero"
    >
      <GradientBlobs />
      {!reducedMotion ? <HeroScene /> : null}

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={item}>
            <Badge variant="outline" className="gap-1.5 px-4 py-1.5 text-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-gold" />
              </span>
              Now live for creators in India 🇮🇳
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            Receive support{" "}
            <span className="text-gradient">directly</span> with UPI.
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-xl text-lg text-muted-foreground sm:text-xl"
          >
            Create your own support page in under one minute. Supporters pay
            straight to your UPI ID — no gateway, no platform fees, no
            middleman.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button variant="gradient" size="xl" asChild>
              <Link href={ROUTES.signup}>
                Create Your Page
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/#demo">See Demo</Link>
            </Button>
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <li className="flex items-center gap-1.5">
              <IndianRupee className="size-4 text-brand-gold" aria-hidden />
              100% of every payment is yours
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-brand-gold" aria-hidden />
              We never touch the money
            </li>
            <li className="flex items-center gap-1.5">
              <Zap className="size-4 text-brand-gold" aria-hidden />
              Set up in under a minute
            </li>
          </motion.ul>
        </motion.div>
      </div>

      {/* Bottom fade into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
}
