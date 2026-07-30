import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as a compact stat, e.g. 12800 -> "12.8K". */
export function formatCompactNumber(value: number, locale = "en-IN"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Format an amount in a given currency, e.g. (100, "INR") -> "₹100". */
export function formatCurrency(
  amount: number,
  currency: string,
  locale = "en-IN",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** Build an absolute URL on the configured site origin. */
export function absoluteUrl(path = "/"): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://buymeagoddie.com";
  return new URL(path, base).toString();
}

/** Derive up-to-two-letter initials from a display name. */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/** Await-able delay, used for staggered optimistic UI. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
