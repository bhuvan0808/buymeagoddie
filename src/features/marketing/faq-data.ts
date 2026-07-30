/**
 * FAQ content, shared by the landing accordion and the FAQPage JSON-LD.
 */
export const FAQ_ITEMS = [
  {
    question: "How does BuyMeAGoddie work?",
    answer:
      "You create a beautiful profile page and add your UPI ID. When a supporter taps an amount, we build a standard UPI deep link that opens their own payment app — Google Pay, PhonePe, Paytm, BHIM — with your details pre-filled. They confirm, and the money lands directly in your bank account.",
  },
  {
    question: "Do you charge fees?",
    answer:
      "No. BuyMeAGoddie takes zero platform or transaction fees. Because payments go straight from your supporter's UPI app to your bank, there is no point in the flow where we could take a cut — and we like it that way.",
  },
  {
    question: "Where does the money go?",
    answer:
      "Directly from your supporter to you. Money moves supporter → creator over UPI. It never passes through BuyMeAGoddie — we are not a payment gateway, not a wallet, and we never hold funds.",
  },
  {
    question: "Do I need Razorpay?",
    answer:
      "No. There is no payment gateway to sign up for, no merchant onboarding, and no KYC paperwork. Your existing UPI ID is all you need.",
  },
  {
    question: "Do I need Stripe?",
    answer:
      "No. Stripe, Razorpay, and other gateways are for platforms that process money. BuyMeAGoddie never processes money — supporters pay you directly through UPI.",
  },
  {
    question: "Can I change my UPI ID?",
    answer:
      "Yes, anytime. Update it in your dashboard and your page, payment links, and QR code refresh instantly.",
  },
  {
    question: "Is my money safe?",
    answer:
      "Yes — it's as safe as UPI itself, because that's all there is. Payments happen inside your supporter's own UPI app, protected by their UPI PIN and their bank. We only store your public UPI ID; we never ask for your PIN, OTP, bank password, or card details.",
  },
] as const;
