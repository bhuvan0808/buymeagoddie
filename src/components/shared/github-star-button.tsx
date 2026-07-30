import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/features/profile/components/social-icons";
import { GITHUB_REPO_URL } from "@/lib/github";
import { formatCompactNumber, cn } from "@/lib/utils";

/**
 * "We're open source" button: GitHub mark + live star count.
 * Server-fetched stars are passed in so this stays render-only.
 */
export function GitHubStarButton({
  stars,
  className,
}: {
  stars: number | null;
  className?: string;
}) {
  return (
    <Button variant="outline" size="sm" asChild className={cn("gap-2", className)}>
      <a
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Star BuyMeAGoddie on GitHub${stars !== null ? ` — ${stars} stars` : ""}`}
      >
        <GithubIcon className="size-4" />
        <span className="hidden sm:inline">Open Source</span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Star className="size-3.5 fill-current text-brand-gold" aria-hidden />
          {stars !== null ? formatCompactNumber(stars) : "Star"}
        </span>
      </a>
    </Button>
  );
}
