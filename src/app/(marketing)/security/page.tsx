import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";

export const metadata: Metadata = {
  title: "Security",
  description: "How BuyMeAGoddie keeps creators and supporters safe.",
};

export default function SecurityPage() {
  return (
    <ContentPage title="Security" updated="July 30, 2026">
      <h2>The safest architecture is holding nothing</h2>
      <p>
        BuyMeAGoddie never processes, holds, or routes money. Payments happen
        inside your supporter&apos;s own UPI app, protected by their UPI PIN
        and bank. The only payment data we store is your{" "}
        <strong>public</strong> UPI ID — the same one printed on shop QR
        stands across India.
      </p>
      <h2>We will never ask for</h2>
      <ul>
        <li>Your UPI PIN</li>
        <li>OTPs of any kind</li>
        <li>Bank passwords or netbanking credentials</li>
        <li>Debit or credit card numbers</li>
      </ul>
      <p>
        Anyone asking for these while claiming to be BuyMeAGoddie is
        attempting fraud — report it to us and to your bank.
      </p>
      <h2>Platform safeguards</h2>
      <ul>
        <li>Row-level security on every database table — users can only write their own data</li>
        <li>All input validated server-side (Zod) and constrained in the database</li>
        <li>HTTPS everywhere, secure session cookies, modern security headers</li>
        <li>React&apos;s output encoding plus strict validation guards against XSS; no raw HTML is ever rendered from user content</li>
      </ul>
      <h2>Reporting a vulnerability</h2>
      <p>
        Found something? Email security@buymeagoddie.com — we respond fast
        and appreciate responsible disclosure.
      </p>
    </ContentPage>
  );
}
