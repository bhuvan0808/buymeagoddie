import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { getGitHubStars } from "@/lib/github";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stars = await getGitHubStars();

  return (
    <SmoothScroll>
      <a
        href="#main"
        className="focus-ring sr-only z-[60] rounded-lg bg-background px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader stars={stars} />
      <main id="main">{children}</main>
      <SiteFooter stars={stars} />
    </SmoothScroll>
  );
}
