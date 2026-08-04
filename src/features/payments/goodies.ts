import {
  Cake,
  Camera,
  Candy,
  Coffee,
  Cookie,
  Mic,
  PenLine,
  Pizza,
  Rocket,
  UtensilsCrossed,
  Video,
  type LucideIcon,
} from "lucide-react";

/**
 * Goodie tiers: every amount maps to a real-world "goodie" so supporting a
 * creator feels like gifting a thing, not transferring money. Rendered with
 * a consistent icon set (emoji kept for plain-text contexts like payment
 * notes and share messages).
 */
export interface Goodie {
  /** Minimum amount (INR) for this tier. */
  min: number;
  icon: LucideIcon;
  emoji: string;
  /** Label with article, reads as "you're gifting {label}". */
  label: string;
}

export const GOODIE_TIERS: Goodie[] = [
  { min: 0, icon: Candy, emoji: "🍬", label: "a candy" },
  { min: 10, icon: PenLine, emoji: "🖊️", label: "a pen" },
  { min: 25, icon: Coffee, emoji: "☕", label: "a chai" },
  { min: 50, icon: Cookie, emoji: "🍪", label: "a cookie" },
  { min: 100, icon: Cake, emoji: "🧁", label: "a cupcake" },
  { min: 250, icon: Pizza, emoji: "🍕", label: "a pizza" },
  { min: 500, icon: UtensilsCrossed, emoji: "🍱", label: "a feast" },
  { min: 1000, icon: Camera, emoji: "📸", label: "a tripod" },
  { min: 2500, icon: Mic, emoji: "🎙️", label: "a mic" },
  { min: 5000, icon: Video, emoji: "🎥", label: "a gimbal" },
  { min: 10000, icon: Rocket, emoji: "🚀", label: "a dream upgrade" },
];

/** The goodie a given amount buys — highest tier the amount reaches. */
export function getGoodie(amount: number): Goodie {
  let match = GOODIE_TIERS[0]!;
  for (const tier of GOODIE_TIERS) {
    if (amount >= tier.min) match = tier;
  }
  return match;
}
