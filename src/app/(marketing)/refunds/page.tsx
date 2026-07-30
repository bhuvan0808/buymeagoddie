import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "How refunds work on BuyMeAGoddie.",
};

export default function RefundsPage() {
  return (
    <ContentPage title="Refund Policy" updated="July 30, 2026">
      <h2>The short version</h2>
      <p>
        BuyMeAGoddie never touches money, so <strong>we cannot issue
        refunds</strong> — there is nothing in our hands to refund from.
        Every payment goes directly from a supporter&apos;s UPI app to a
        creator&apos;s bank account.
      </p>
      <h2>If you paid a creator by mistake</h2>
      <ul>
        <li>Contact the creator directly — they can send the amount back over UPI in seconds</li>
        <li>For unauthorized or fraudulent transactions, contact your bank or UPI app support immediately; UPI disputes are governed by NPCI rules</li>
      </ul>
      <h2>Platform charges</h2>
      <p>
        BuyMeAGoddie is free and takes no fees, so there are no platform
        charges to refund.
      </p>
    </ContentPage>
  );
}
