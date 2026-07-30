"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";

import { Badge } from "@/components/ui/badge";

type Stat = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  comingSoon?: boolean;
};

const STATS: Stat[] = [
  { label: "Creators", value: 1200, suffix: "+" },
  { label: "Money Supported", value: 4800000, prefix: "₹", suffix: "+" },
  { label: "Countries", value: 1, comingSoon: true },
  { label: "UPI Payments", value: 38000, suffix: "+" },
];

function formatStat(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  return String(Math.round(value));
}

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const display = useTransform(
    motionValue,
    (latest) => `${stat.prefix ?? ""}${formatStat(latest)}${stat.suffix ?? ""}`,
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, stat.value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, motionValue, stat.value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
    </span>
  );
}

export function SocialProof() {
  return (
    <section aria-label="Platform statistics" className="relative py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="glass-card grid grid-cols-2 gap-8 rounded-3xl px-8 py-10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span className="font-display text-3xl font-bold sm:text-4xl">
                <Counter stat={stat} />
              </span>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                {stat.label}
                {stat.comingSoon ? (
                  <Badge variant="soon" className="text-[10px]">
                    more soon
                  </Badge>
                ) : null}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground/60">
          Early-access figures, updated as the community grows.
        </p>
      </div>
    </section>
  );
}
