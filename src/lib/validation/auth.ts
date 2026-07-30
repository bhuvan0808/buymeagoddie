import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.");

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters.")
  .max(72, "At most 72 characters.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type SignupInput = z.infer<typeof signupSchema>;

export const magicLinkSchema = z.object({
  email: emailSchema,
});
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((value) => value.password === value.confirm, {
    message: "Passwords don't match.",
    path: ["confirm"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
