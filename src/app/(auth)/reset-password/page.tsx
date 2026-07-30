import type { Metadata } from "next";

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new BuyMeAGoddie password.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
