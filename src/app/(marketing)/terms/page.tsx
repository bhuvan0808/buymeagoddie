import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of BuyMeAGoddie.",
};

export default function TermsPage() {
  return (
    <ContentPage title="Terms of Service" updated="July 30, 2026">
      <h2>What BuyMeAGoddie is</h2>
      <p>
        BuyMeAGoddie provides creator profile pages that display your public
        payment identifier (such as a UPI ID) and generate standard payment
        deep links and QR codes. <strong>We are not a payment gateway, a
        wallet, or a money transmitter.</strong> We never receive, hold, or
        transmit funds. All payments occur directly between a supporter and a
        creator through their own payment apps and banks.
      </p>
      <h2>Your responsibilities</h2>
      <ul>
        <li>Provide a payment identifier that belongs to you</li>
        <li>Use your page for lawful purposes only</li>
        <li>Don&apos;t impersonate others or mislead supporters</li>
        <li>Comply with your local tax obligations for money you receive</li>
      </ul>
      <h2>Payments and disputes</h2>
      <p>
        Because money moves directly between supporter and creator over UPI,
        payment disputes are handled by the participants&apos; banks and UPI
        apps under NPCI rules. BuyMeAGoddie cannot reverse, refund, or
        intercept payments.
      </p>
      <h2>Account termination</h2>
      <p>
        We may suspend pages that violate these terms, impersonate others, or
        are used for fraud. You may delete your account at any time.
      </p>
      <h2>Liability</h2>
      <p>
        The service is provided &quot;as is&quot;. To the maximum extent
        permitted by law, we are not liable for payment failures, bank
        issues, or losses arising from transactions between supporters and
        creators.
      </p>
    </ContentPage>
  );
}
