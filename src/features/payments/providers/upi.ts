import type {
  PaymentLinkParams,
  PaymentMethodDefinition,
} from "@/features/payments/types";

/**
 * UPI Virtual Payment Address: handle@psp
 * Handle: alphanumeric plus dot/hyphen/underscore, 2–256 chars total.
 * PSP suffix: letters only (okhdfcbank, okaxis, ybl, paytm, …).
 */
const UPI_VPA_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,}@[a-zA-Z]{2,64}$/;

function validateIdentifier(identifier: string): string | null {
  const value = identifier.trim();
  if (value.length === 0) return "Enter your UPI ID.";
  if (value.length > 256) return "UPI ID is too long.";
  if (!value.includes("@")) {
    return "A UPI ID looks like name@bank, e.g. bhuvan@okhdfcbank.";
  }
  if (!UPI_VPA_PATTERN.test(value)) {
    return "That doesn't look like a valid UPI ID. Check for typos.";
  }
  return null;
}

/**
 * Builds a NPCI-spec deep link: upi://pay?pa=...&pn=...&am=...&cu=INR
 * Opens Google Pay / PhonePe / Paytm / BHIM directly on mobile.
 */
function buildPaymentUri({
  identifier,
  payeeName,
  amount,
  note,
}: PaymentLinkParams): string {
  const params = new URLSearchParams({
    pa: identifier.trim(),
    pn: payeeName.slice(0, 60),
    cu: "INR",
  });
  if (amount && amount > 0) {
    params.set("am", amount.toFixed(2));
  }
  if (note) {
    params.set("tn", note.slice(0, 80));
  }
  return `upi://pay?${params.toString()}`;
}

export const upi: PaymentMethodDefinition = {
  id: "upi",
  name: "UPI",
  country: "IN",
  countryName: "India",
  flag: "🇮🇳",
  currency: "INR",
  currencySymbol: "₹",
  status: "active",
  identifierLabel: "UPI ID",
  identifierPlaceholder: "bhuvan@okhdfcbank",
  identifierHelp:
    "Find it in Google Pay, PhonePe, or Paytm under your profile. We only store the ID — never your PIN or bank details.",
  presetAmounts: [50, 100, 250, 500, 1000],
  validateIdentifier,
  buildPaymentUri,
};
