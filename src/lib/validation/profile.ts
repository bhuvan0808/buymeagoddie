import { z } from "zod";

import {
  BIO_MAX_LENGTH,
  NAME_MAX_LENGTH,
  RESERVED_USERNAMES,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import { getPaymentMethod } from "@/features/payments/registry";

/**
 * Username rules: unique (checked server-side), lowercase letters, numbers,
 * hyphens. Must start/end alphanumeric, no consecutive hyphens, and must not
 * collide with reserved routes.
 */
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(USERNAME_MIN_LENGTH, `At least ${USERNAME_MIN_LENGTH} characters.`)
  .max(USERNAME_MAX_LENGTH, `At most ${USERNAME_MAX_LENGTH} characters.`)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Lowercase letters, numbers, and single hyphens only.",
  )
  .refine((value) => !RESERVED_USERNAMES.has(value), {
    message: "That username is reserved.",
  });

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Enter your name.")
  .max(NAME_MAX_LENGTH, `At most ${NAME_MAX_LENGTH} characters.`);

export const bioSchema = z
  .string()
  .trim()
  .max(BIO_MAX_LENGTH, `At most ${BIO_MAX_LENGTH} characters.`)
  .optional()
  .or(z.literal(""));

export const profileSchema = z.object({
  name: displayNameSchema,
  username: usernameSchema,
  bio: bioSchema,
});

export type ProfileInput = z.infer<typeof profileSchema>;

/**
 * Payment identifier is validated by the rail's own definition so each
 * country's format rules live next to its deep-link builder.
 */
export const paymentSchema = z
  .object({
    provider: z.string().min(1),
    identifier: z.string().trim().min(1, "Enter your payment ID."),
  })
  .superRefine((value, ctx) => {
    const method = getPaymentMethod(value.provider);
    if (!method) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["provider"],
        message: "Unknown payment method.",
      });
      return;
    }
    if (method.status !== "active") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["provider"],
        message: `${method.name} is coming soon.`,
      });
      return;
    }
    const error = method.validateIdentifier(value.identifier);
    if (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["identifier"],
        message: error,
      });
    }
  });

export type PaymentInput = z.infer<typeof paymentSchema>;

export const socialLinkSchema = z.object({
  platform: z.enum([
    "instagram",
    "twitter",
    "youtube",
    "github",
    "linkedin",
    "website",
  ]),
  url: z
    .string()
    .trim()
    .url("Enter a full URL, starting with https://")
    .max(300)
    .refine((value) => value.startsWith("https://"), {
      message: "Links must use https://",
    }),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

export const settingsSchema = z.object({
  show_qr: z.boolean(),
  show_social_links: z.boolean(),
  allow_custom_amount: z.boolean(),
  theme: z.enum(["midnight", "aurora", "sunset", "daylight"]),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

/** Custom donation amount typed by a supporter on a profile page. */
export const customAmountSchema = z.coerce
  .number()
  .positive("Enter an amount above zero.")
  .max(100000, "Amounts above ₹1,00,000 aren't supported.")
  .multipleOf(0.01);
