/**
 * Usernames that can never be claimed because they collide with routes,
 * infrastructure, or impersonation risks.
 */
export const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "api",
  "app",
  "auth",
  "blog",
  "compare",
  "contact",
  "cookies",
  "dashboard",
  "docs",
  "feedback",
  "help",
  "home",
  "legal",
  "login",
  "logout",
  "me",
  "onboarding",
  "pricing",
  "privacy",
  "profile",
  "refunds",
  "root",
  "security",
  "settings",
  "signin",
  "signout",
  "signup",
  "sitemap",
  "static",
  "status",
  "support",
  "terms",
  "www",
]);

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const BIO_MAX_LENGTH = 280;
export const NAME_MAX_LENGTH = 60;

/** Route constants — never hardcode paths in components. */
export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  authCallback: "/auth/callback",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  dashboardAppearance: "/dashboard/appearance",
  dashboardLinks: "/dashboard/links",
  dashboardSettings: "/dashboard/settings",
  dashboardAnalytics: "/dashboard/analytics",
  dashboardSupport: "/dashboard/support",
  profile: (username: string) => `/${username}`,
} as const;

/** Social platforms creators can link from their page. */
export const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", urlPrefix: "https://instagram.com/" },
  { id: "twitter", label: "Twitter / X", urlPrefix: "https://x.com/" },
  { id: "youtube", label: "YouTube", urlPrefix: "https://youtube.com/@" },
  { id: "github", label: "GitHub", urlPrefix: "https://github.com/" },
  { id: "linkedin", label: "LinkedIn", urlPrefix: "https://linkedin.com/in/" },
  { id: "website", label: "Website", urlPrefix: "https://" },
] as const;

export type SocialPlatformId = (typeof SOCIAL_PLATFORMS)[number]["id"];

/** Profile page themes a creator can choose. */
export const PROFILE_THEMES = [
  { id: "midnight", label: "Midnight", swatch: "oklch(0.16 0.03 290)" },
  { id: "aurora", label: "Aurora", swatch: "oklch(0.2 0.06 200)" },
  { id: "sunset", label: "Sunset", swatch: "oklch(0.22 0.06 30)" },
  { id: "daylight", label: "Daylight", swatch: "oklch(0.97 0.01 300)" },
] as const;

export type ProfileThemeId = (typeof PROFILE_THEMES)[number]["id"];
