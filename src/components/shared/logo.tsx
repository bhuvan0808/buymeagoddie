import Link from "next/link";

import { GoddieMark } from "@/components/shared/goddie-mark";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Wordmark: the Goddie gift mark + lowercase "buymeagoddie",
 * with the brand gradient sweeping across "meagoddie".
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
      <GoddieMark className="size-8" />
      <span>
        buy<span className="text-gradient">meagoddie</span>
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
