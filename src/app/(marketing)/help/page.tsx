import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/features/marketing/faq-data";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers to common BuyMeAGoddie questions.",
};

const HELP_ITEMS = [
  ...FAQ_ITEMS,
  {
    question: "How do I find my UPI ID?",
    answer:
      "Open Google Pay, PhonePe, or Paytm and tap your profile photo. Your UPI ID looks like name@bank (e.g. bhuvan@okhdfcbank). Copy it exactly as shown.",
  },
  {
    question: "Why does the payment open a QR code on desktop?",
    answer:
      "UPI apps live on phones, so desktop browsers can't open a upi:// link. Instead we show a QR code your supporter scans with any UPI app — same direct payment, one extra scan.",
  },
  {
    question: "Can I change my username?",
    answer:
      "Yes, in Dashboard → Profile. Note that your old link stops working immediately, so update your bios after changing it.",
  },
];

export default function HelpPage() {
  return (
    <ContentPage title="Help Center">
      <Accordion type="single" collapsible className="flex flex-col gap-3">
        {HELP_ITEMS.map((item, index) => (
          <AccordionItem key={item.question} value={`help-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p>
        Still stuck? Email <strong>support@buymeagoddie.com</strong> — a
        human answers.
      </p>
    </ContentPage>
  );
}
