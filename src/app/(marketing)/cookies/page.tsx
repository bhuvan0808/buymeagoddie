import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "The cookies BuyMeAGoddie uses and why.",
};

export default function CookiesPage() {
  return (
    <ContentPage title="Cookie Policy" updated="July 30, 2026">
      <h2>Cookies we use</h2>
      <ul>
        <li>
          <strong>Authentication cookies</strong> — set by Supabase Auth to
          keep you signed in. Essential; removed on sign-out.
        </li>
        <li>
          <strong>Theme preference</strong> — remembers your dark/light mode
          choice locally.
        </li>
      </ul>
      <h2>What we don&apos;t use</h2>
      <p>
        No advertising cookies, no cross-site trackers, no fingerprinting,
        and no third-party analytics cookies. Visitors to creator pages are
        not tracked.
      </p>
    </ContentPage>
  );
}
