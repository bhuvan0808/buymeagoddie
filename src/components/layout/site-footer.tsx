import Link from "next/link";

import { GitHubStarButton } from "@/components/shared/github-star-button";
import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { footerNav, siteConfig } from "@/lib/site";

export function SiteFooter({ stars = null }: { stars?: number | null }) {
  return (
    <footer className="relative border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Beautiful creator pages. Direct payments. Your supporters pay
              you — we never touch the money.
            </p>
            <Badge variant="gold" className="w-fit">
              Made for creators in India 🇮🇳
            </Badge>
            <div className="mt-1 flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Proudly open source under the MIT license. Contributions and
                PRs welcome.
              </p>
              <GitHubStarButton stars={stars} className="w-fit" />
            </div>
            <a
              href={siteConfig.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring glass group mt-2 flex w-fit flex-col gap-0.5 rounded-2xl px-4 py-3 transition-colors hover:bg-foreground/5"
            >
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Part of the {siteConfig.parent.name} family
              </span>
              <span className="text-sm font-semibold group-hover:text-gradient">
                {siteConfig.parent.name} — {siteConfig.parent.tagline}
              </span>
            </a>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="mb-3 text-sm font-semibold">{group.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="focus-ring inline-flex items-center gap-1.5 rounded text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                      {item.comingSoon ? (
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">
                          soon
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <p>
            Not a payment gateway. Not a wallet. Money flows directly from
            supporter to creator.
          </p>
        </div>
      </div>
    </footer>
  );
}
