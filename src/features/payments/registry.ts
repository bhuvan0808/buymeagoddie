import { upi } from "@/features/payments/providers/upi";
import type {
  PaymentMethodDefinition,
  PaymentProviderId,
} from "@/features/payments/types";

/**
 * Rails on the roadmap. They render as "Coming Soon" in country selection
 * and become creatable simply by flipping status to "active" and supplying
 * real validate/build implementations.
 */
function comingSoon(
  def: Omit<
    PaymentMethodDefinition,
    "status" | "validateIdentifier" | "buildPaymentUri" | "presetAmounts"
  > & { presetAmounts?: number[] },
): PaymentMethodDefinition {
  return {
    ...def,
    status: "coming_soon",
    presetAmounts: def.presetAmounts ?? [],
    validateIdentifier: () => `${def.name} isn't available yet.`,
    buildPaymentUri: () => {
      throw new Error(`${def.name} is not available yet.`);
    },
  };
}

export const PAYMENT_METHODS: Record<PaymentProviderId, PaymentMethodDefinition> =
  {
    upi,
    pix: comingSoon({
      id: "pix",
      name: "Pix",
      country: "BR",
      countryName: "Brazil",
      flag: "🇧🇷",
      currency: "BRL",
      currencySymbol: "R$",
      identifierLabel: "Pix Key",
      identifierPlaceholder: "you@email.com",
      identifierHelp: "Your Pix key: email, phone, CPF, or random key.",
    }),
    paynow: comingSoon({
      id: "paynow",
      name: "PayNow",
      country: "SG",
      countryName: "Singapore",
      flag: "🇸🇬",
      currency: "SGD",
      currencySymbol: "S$",
      identifierLabel: "PayNow ID",
      identifierPlaceholder: "+65 9123 4567",
      identifierHelp: "Your PayNow mobile number, NRIC, or UEN.",
    }),
    promptpay: comingSoon({
      id: "promptpay",
      name: "PromptPay",
      country: "TH",
      countryName: "Thailand",
      flag: "🇹🇭",
      currency: "THB",
      currencySymbol: "฿",
      identifierLabel: "PromptPay ID",
      identifierPlaceholder: "+66 81 234 5678",
      identifierHelp: "Your PromptPay mobile number or citizen ID.",
    }),
    qris: comingSoon({
      id: "qris",
      name: "QRIS",
      country: "ID",
      countryName: "Indonesia",
      flag: "🇮🇩",
      currency: "IDR",
      currencySymbol: "Rp",
      identifierLabel: "QRIS ID",
      identifierPlaceholder: "your-qris-id",
      identifierHelp: "Your QRIS merchant identifier.",
    }),
    sepa_instant: comingSoon({
      id: "sepa_instant",
      name: "SEPA Instant",
      country: "EU",
      countryName: "Europe",
      flag: "🇪🇺",
      currency: "EUR",
      currencySymbol: "€",
      identifierLabel: "IBAN",
      identifierPlaceholder: "DE89 3704 0044 0532 0130 00",
      identifierHelp: "Your IBAN for SEPA Instant transfers.",
    }),
    aani: comingSoon({
      id: "aani",
      name: "Aani",
      country: "AE",
      countryName: "United Arab Emirates",
      flag: "🇦🇪",
      currency: "AED",
      currencySymbol: "د.إ",
      identifierLabel: "Aani ID",
      identifierPlaceholder: "+971 50 123 4567",
      identifierHelp: "Your Aani-linked mobile number or email.",
    }),
  };

export const ACTIVE_PAYMENT_METHODS = Object.values(PAYMENT_METHODS).filter(
  (method) => method.status === "active",
);

export const COMING_SOON_PAYMENT_METHODS = Object.values(
  PAYMENT_METHODS,
).filter((method) => method.status === "coming_soon");

export function getPaymentMethod(
  id: string,
): PaymentMethodDefinition | undefined {
  return PAYMENT_METHODS[id as PaymentProviderId];
}

/** The default rail for launch. */
export const DEFAULT_PAYMENT_METHOD = upi;
