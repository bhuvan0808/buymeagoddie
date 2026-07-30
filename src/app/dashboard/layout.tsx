import type { Metadata } from "next";

import { GradientBlobs } from "@/components/shared/gradient-blobs";
import { DashboardSidebar } from "@/features/dashboard/components/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-svh overflow-x-clip">
      <GradientBlobs intensity="subtle" />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:flex-row">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
