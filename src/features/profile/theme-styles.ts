import type { ProfileThemeId } from "@/lib/constants";

/**
 * Visual treatments for each profile theme. The page backdrop and card
 * accents change; layout and behavior stay identical.
 */
export const PROFILE_THEME_STYLES: Record<
  ProfileThemeId,
  {
    /** Full-page backdrop behind the profile card. */
    page: string;
    /** Whether this theme uses the dark foreground palette. */
    dark: boolean;
    /** Accent gradient for the primary support button. */
    accent: string;
  }
> = {
  midnight: {
    page: "bg-[radial-gradient(ellipse_at_top,oklch(0.24_0.06_292),oklch(0.14_0.02_290))]",
    dark: true,
    accent: "from-violet-500 via-fuchsia-500 to-amber-400",
  },
  aurora: {
    page: "bg-[radial-gradient(ellipse_at_top,oklch(0.3_0.08_220),oklch(0.15_0.03_240))]",
    dark: true,
    accent: "from-cyan-400 via-teal-400 to-emerald-400",
  },
  sunset: {
    page: "bg-[radial-gradient(ellipse_at_top,oklch(0.32_0.09_30),oklch(0.16_0.03_20))]",
    dark: true,
    accent: "from-orange-400 via-rose-400 to-fuchsia-500",
  },
  daylight: {
    page: "bg-[radial-gradient(ellipse_at_top,oklch(0.99_0.01_300),oklch(0.93_0.02_290))]",
    dark: false,
    accent: "from-violet-500 via-fuchsia-500 to-amber-400",
  },
};
