import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  COMPARISONS,
  getComparison,
} from "@/features/marketing/comparisons";
import { ROUTES } from "@/lib/constants";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COMPARISONS.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return { title: "Comparison not found" };
  return {
    title: `${siteConfig.name} vs ${comparison.competitor}`,
    description: comparison.summary,
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6">
      <h1 className="text-4xl font-bold">
        {siteConfig.name}{" "}
        <span className="text-muted-foreground">vs</span>{" "}
        <span className="text-gradient">{comparison.competitor}</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        {comparison.summary}
      </p>

      <div className="glass-card mt-10 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[36rem] text-sm">
          <caption className="sr-only">
            Feature comparison between {siteConfig.name} and{" "}
            {comparison.competitor}
          </caption>
          <thead>
            <tr className="border-b border-border text-left">
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">
                &nbsp;
              </th>
              <th scope="col" className="px-6 py-4 font-display font-semibold">
                {siteConfig.name}
              </th>
              <th scope="col" className="px-6 py-4 font-display font-semibold">
                {comparison.competitor}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.dimension} className="border-b border-border/50 last:border-0">
                <th scope="row" className="px-6 py-4 text-left font-medium">
                  {row.dimension}
                </th>
                <td className="px-6 py-4">
                  <span className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden />
                    {row.us}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{row.them}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex flex-col items-start gap-4">
        <p className="text-sm text-muted-foreground">
          Comparisons based on publicly listed pricing as of July 2026.
          Different tools for different jobs — pick what fits yours.
        </p>
        <Button variant="gradient" size="lg" asChild>
          <Link href={ROUTES.signup}>Try {siteConfig.name} free</Link>
        </Button>
      </div>
    </article>
  );
}
