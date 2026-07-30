import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BuyMeAGoddie collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy Policy" updated="July 30, 2026">
      <h2>What we collect</h2>
      <p>
        We collect the minimum needed to run your page: your email, display
        name, username, bio, profile photo, and your public payment
        identifier (your UPI ID). That&apos;s it.
      </p>
      <h2>What we never collect</h2>
      <ul>
        <li>UPI PIN, OTPs, or bank passwords — never, under any circumstance</li>
        <li>Bank account or card numbers</li>
        <li>Payment amounts or transaction history — payments happen entirely between your supporter&apos;s UPI app and your bank</li>
      </ul>
      <h2>How your data is used</h2>
      <p>
        Your profile data is displayed publicly on your page — that is its
        purpose. Your email is used for authentication and essential service
        messages only. We do not sell data to anyone.
      </p>
      <h2>Where it lives</h2>
      <p>
        Data is stored with Supabase (PostgreSQL) with row-level security:
        only you can modify your records. Public pages read only the fields
        they display.
      </p>
      <h2>Your rights</h2>
      <p>
        You can edit or delete your profile at any time from the dashboard.
        Deleting your account removes your profile, links, and settings.
        Contact us for a full data export or erasure request.
      </p>
    </ContentPage>
  );
}
