import Link from "next/link";

import { GradientBlobs } from "@/components/shared/gradient-blobs";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden px-4 text-center">
      <GradientBlobs intensity="subtle" />
      <Logo />
      <h1 className="font-display text-7xl font-extrabold">
        4<span className="text-gradient">0</span>4
      </h1>
      <p className="max-w-sm text-muted-foreground">
        This page doesn&apos;t exist — but the username might still be
        available.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href={ROUTES.home}>Go home</Link>
        </Button>
        <Button variant="gradient" asChild>
          <Link href={ROUTES.signup}>Claim your page</Link>
        </Button>
      </div>
    </div>
  );
}
