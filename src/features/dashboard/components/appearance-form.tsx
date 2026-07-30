"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateSettings } from "@/features/dashboard/actions";
import { PROFILE_THEME_STYLES } from "@/features/profile/theme-styles";
import { PROFILE_THEMES, type ProfileThemeId } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SettingsRow } from "@/types/database";

export function AppearanceForm({ settings }: { settings: SettingsRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [theme, setTheme] = useState<ProfileThemeId>(
    (settings.theme as ProfileThemeId) ?? "midnight",
  );

  function handleSave() {
    startTransition(async () => {
      const result = await updateSettings({
        show_qr: settings.show_qr,
        show_social_links: settings.show_social_links,
        allow_custom_amount: settings.allow_custom_amount,
        theme,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Theme updated");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          The backdrop and accent colors of your public page.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div
          role="radiogroup"
          aria-label="Profile theme"
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {PROFILE_THEMES.map((option) => {
            const style = PROFILE_THEME_STYLES[option.id];
            const active = theme === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTheme(option.id)}
                className={cn(
                  "focus-ring group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all",
                  active
                    ? "border-primary glow-ring"
                    : "border-transparent hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "relative flex h-24 items-end justify-between p-3",
                    style.page,
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-2 w-12 rounded-full bg-gradient-to-r",
                      style.accent,
                    )}
                    aria-hidden
                  />
                  {active ? (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" aria-hidden />
                    </span>
                  ) : null}
                </span>
                <span className="block bg-card px-3 py-2 text-left text-sm font-medium">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
        <Button
          onClick={handleSave}
          loading={pending}
          className="self-start"
          disabled={theme === settings.theme}
        >
          Save theme
        </Button>
      </CardContent>
    </Card>
  );
}
