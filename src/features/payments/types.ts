/**
 * Generic payment-method abstraction.
 *
 * BuyMeAGoddie never touches money — it only builds deep links / QR payloads
 * that open the supporter's own payment app. Every country rail (UPI, Pix,
 * PayNow, PromptPay, QRIS, SEPA Instant, Aani, …) is described by a
 * PaymentMethodDefinition. Adding a new rail means adding one definition —
 * no UI or schema changes.
 */

export type PaymentProviderId =
  | "upi"
  | "pix"
  | "paynow"
  | "promptpay"
  | "qris"
  | "sepa_instant"
  | "aani";

export interface PaymentLinkParams {
  /** The creator's payment identifier (e.g. a UPI VPA). */
  identifier: string;
  /** Display name of the payee, shown inside the payment app. */
  payeeName: string;
  /** Amount in the rail's currency. Omit to let the supporter choose in-app. */
  amount?: number;
  /** Short note attached to the payment. */
  note?: string;
}

export interface PaymentMethodDefinition {
  id: PaymentProviderId;
  /** Human name, e.g. "UPI". */
  name: string;
  /** ISO 3166-1 alpha-2 country code, or "EU" for SEPA. */
  country: string;
  countryName: string;
  /** Flag emoji for quick visual identification. */
  flag: string;
  /** ISO 4217 currency code. */
  currency: string;
  currencySymbol: string;
  /** Whether creators can activate this rail today. */
  status: "active" | "coming_soon";
  /** Label for the identifier field, e.g. "UPI ID". */
  identifierLabel: string;
  identifierPlaceholder: string;
  identifierHelp: string;
  /** Suggested one-tap amounts on profile pages. */
  presetAmounts: number[];
  /** Validate a payment identifier. Returns an error message or null. */
  validateIdentifier(identifier: string): string | null;
  /** Build the deep link a supporter's phone opens to pay. */
  buildPaymentUri(params: PaymentLinkParams): string;
}
