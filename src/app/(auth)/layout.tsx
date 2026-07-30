import Link from "next/link";

import { GradientBlobs } from "@/components/shared/gradient-blobs";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <GradientBlobs />
      <header className="flex items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="focus-ring rounded-full text-sm text-muted-foreground hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-4">
        <div className="glass-card w-full max-w-md rounded-3xl p-8 sm:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
