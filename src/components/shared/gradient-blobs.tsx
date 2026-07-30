import { cn } from "@/lib/utils";

/**
 * Decorative gradient lighting. Pure CSS — zero JS cost — so it can sit
 * behind any section. Marked aria-hidden; purely visual.
 */
export function GradientBlobs({
  className,
  intensity = "default",
}: {
  className?: string;
  intensity?: "default" | "subtle";
}) {
  const opacity = intensity === "subtle" ? "opacity-40" : "opacity-70";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full blur-3xl",
          opacity,
        )}
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklch, var(--brand-violet) 28%, transparent), transparent 70%)",
        }}
      />
      <div
        className={cn(
          "absolute -left-40 top-1/3 h-[26rem] w-[26rem] rounded-full blur-3xl",
          opacity,
        )}
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklch, var(--brand-fuchsia) 20%, transparent), transparent 70%)",
        }}
      />
      <div
        className={cn(
          "absolute -right-40 top-2/3 h-[24rem] w-[24rem] rounded-full blur-3xl",
          opacity,
        )}
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklch, var(--brand-gold) 16%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
