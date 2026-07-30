"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { GitHubStarButton } from "@/components/shared/github-star-button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Sticky navigation that gains a glass blur once the page scrolls.
 */
export function SiteHeader({ stars = null }: { stars?: number | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-nav shadow-sm" : "bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="focus-ring rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <GitHubStarButton stars={stars} />
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href={ROUTES.login}>Login</Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link href={ROUTES.signup}>Create Your Page</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-nav overflow-hidden lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {mainNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring block rounded-xl px-4 py-3 text-base font-medium hover:bg-foreground/5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex flex-col gap-2">
                <GitHubStarButton stars={stars} className="w-full" />
                <Button variant="outline" asChild>
                  <Link href={ROUTES.login}>Login</Link>
                </Button>
                <Button variant="gradient" asChild>
                  <Link href={ROUTES.signup}>Create Your Page</Link>
                </Button>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
