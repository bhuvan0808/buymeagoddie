import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Wordmark: a gradient coin glyph + "BuyMeAGoddie".
 */
export function Logo({
  className,
  asLink = true,
}: {
  className?: string;
  asLink?: boolean;
}) {
  const mark = (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight",
        className,
      )}
    >
      <span
        aria-hidden
        className="bg-gradient-brand relative inline-flex size-7 items-center justify-center rounded-full text-[13px] font-extrabold text-white shadow-[0_2px_12px_-2px] shadow-brand-violet/60"
      >
        ₹
      </span>
      <span>
        BuyMeA<span className="text-gradient">Goddie</span>
      </span>
    </span>
  );

  if (!asLink) return mark;

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className="focus-ring rounded-lg"
    >
      {mark}
    </Link>
  );
}
