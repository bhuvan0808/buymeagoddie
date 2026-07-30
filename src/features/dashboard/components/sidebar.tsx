"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Heart,
  LayoutDashboard,
  Link2,
  LogOut,
  Palette,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/actions";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

const ITEMS: SidebarItem[] = [
  { label: "Profile", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Appearance", href: ROUTES.dashboardAppearance, icon: Palette },
  { label: "Social Links", href: ROUTES.dashboardLinks, icon: Link2 },
  { label: "Settings", href: ROUTES.dashboardSettings, icon: Settings },
  {
    label: "Analytics",
    href: ROUTES.dashboardAnalytics,
    icon: BarChart3,
    comingSoon: true,
  },
  { label: "Support Us", href: ROUTES.dashboardSupport, icon: Heart },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-card flex w-full shrink-0 flex-row items-center justify-between gap-2 rounded-2xl p-3 lg:sticky lg:top-6 lg:h-[calc(100svh-3rem)] lg:w-60 lg:flex-col lg:items-stretch lg:p-4">
      <div className="hidden px-2 pb-6 pt-2 lg:block">
        <Logo />
      </div>

      <nav aria-label="Dashboard" className="flex-1 overflow-x-auto no-scrollbar lg:overflow-visible">
        <ul className="flex flex-row gap-1 lg:flex-col">
          {ITEMS.map(({ label, href, icon: Icon, comingSoon }) => {
            const active =
              href === ROUTES.dashboard
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-ring flex items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                  {comingSoon ? (
                    <Badge variant="soon" className="ml-auto hidden lg:inline-flex">
                      soon
                    </Badge>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <form action={signOut} className="lg:mt-auto">
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
        >
          <LogOut className="size-4" aria-hidden />
          <span className="hidden lg:inline">Sign out</span>
        </Button>
      </form>
    </aside>
  );
}
