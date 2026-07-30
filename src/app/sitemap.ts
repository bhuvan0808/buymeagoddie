import type { MetadataRoute } from "next";

import { COMPARISONS } from "@/features/marketing/comparisons";
import { absoluteUrl } from "@/lib/utils";

/**
 * Static routes are always listed. Creator profiles are indexed through
 * per-page metadata + internal links; enumerating every profile here would
 * require a service-role query at build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/login",
    "/signup",
    "/help",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
    "/security",
    "/refunds",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.6,
  }));

  const comparisonRoutes = COMPARISONS.map((comparison) => ({
    url: absoluteUrl(`/compare/${comparison.slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...comparisonRoutes];
}
