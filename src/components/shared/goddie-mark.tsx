import { cn } from "@/lib/utils";

/**
 * The BuyMeAGoddie brand mark: a gradient glass squircle forming a "G" with
 * a heart cutout, crowned with two petals and a dot (a gift with a bow).
 * Vector recreation of the brand artwork so it stays crisp at every size.
 */
export function GoddieMark({
  className,
  title = "BuyMeAGoddie",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id="goddie-g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="0.45" stopColor="#8b5cf6" />
          <stop offset="0.75" stopColor="#ec4899" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
        <mask id="goddie-m">
          <rect width="64" height="64" fill="white" />
          {/* Heart cutout */}
          <path
            d="M31 51 C26.5 47 19 42 19 35 C19 30.4 22.6 27.2 26.6 27.2 C29.2 27.2 30.9 28.7 31.6 29.8 C32.3 28.7 34 27.2 36.6 27.2 C40.6 27.2 44.2 30.4 44.2 35 C44.2 42 35.5 47 31 51 Z"
            fill="black"
          />
          {/* G opening on the right */}
          <rect x="41" y="37.5" width="15" height="6.5" fill="black" />
        </mask>
      </defs>

      {/* Bow: two petals + dot */}
      <ellipse
        cx="21.5"
        cy="12.5"
        rx="7.5"
        ry="4.8"
        transform="rotate(-28 21.5 12.5)"
        fill="url(#goddie-g)"
      />
      <ellipse
        cx="42.5"
        cy="12.5"
        rx="7.5"
        ry="4.8"
        transform="rotate(28 42.5 12.5)"
        fill="url(#goddie-g)"
      />
      <circle cx="32" cy="7.5" r="4.5" fill="url(#goddie-g)" />

      {/* Gift body / G */}
      <rect
        x="10"
        y="20"
        width="44"
        height="42"
        rx="15"
        fill="url(#goddie-g)"
        mask="url(#goddie-m)"
      />
    </svg>
  );
}
