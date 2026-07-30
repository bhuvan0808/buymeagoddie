/**
 * Goodie tiers: every amount maps to a real-world "goodie" so supporting a
 * creator feels like gifting a thing, not transferring money. Used on
 * profile page amount buttons, the custom amount indicator, and the
 * support widget.
 */
export interface Goodie {
  /** Minimum amount (INR) for this tier. */
  min: number;
  emoji: string;
  /** Label with article, reads as "you're gifting {label}". */
  label: string;
}

export const GOODIE_TIERS: Goodie[] = [
  { min: 0, emoji: "🍬", label: "a candy" },
  { min: 10, emoji: "🖊️", label: "a pen" },
  { min: 25, emoji: "☕", label: "a chai" },
  { min: 50, emoji: "🍪", label: "a cookie" },
  { min: 100, emoji: "🧁", label: "a cupcake" },
  { min: 250, emoji: "🍕", label: "a pizza" },
  { min: 500, emoji: "🍱", label: "a feast" },
  { min: 1000, emoji: "📸", label: "a tripod" },
  { min: 2500, emoji: "🎙️", label: "a mic" },
  { min: 5000, emoji: "🎥", label: "a gimbal" },
  { min: 10000, emoji: "🚀", label: "a dream upgrade" },
];

/** The goodie a given amount buys — highest tier the amount reaches. */
export function getGoodie(amount: number): Goodie {
  let match = GOODIE_TIERS[0]!;
  for (const tier of GOODIE_TIERS) {
    if (amount >= tier.min) match = tier;
  }
  return match;
}
