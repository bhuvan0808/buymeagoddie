import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

/**
 * Consistent heading block for landing sections:
 * eyebrow badge → headline → supporting copy.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Badge variant="outline">{eyebrow}</Badge> : null}
      <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? (
        <p className="text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
