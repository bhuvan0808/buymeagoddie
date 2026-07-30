import { BarChart3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="relative">
      {/* Teaser skeleton behind the coming-soon panel */}
      <div aria-hidden className="pointer-events-none select-none opacity-40 blur-[2px]">
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="glass-card rounded-2xl p-6">
              <Skeleton className="mb-3 h-4 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
          ))}
        </div>
        <div className="glass-card mt-4 rounded-2xl p-6">
          <Skeleton className="mb-4 h-4 w-32" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glass-card flex max-w-sm flex-col items-center gap-3 rounded-3xl p-8 text-center">
          <span className="bg-gradient-brand flex size-12 items-center justify-center rounded-2xl text-white">
            <BarChart3 className="size-6" aria-hidden />
          </span>
          <Badge variant="soon">Coming Soon</Badge>
          <h1 className="text-xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Page visits, supporter trends, and top amounts — all without
            compromising your supporters&apos; privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
