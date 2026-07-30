import type { Metadata } from "next";

import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your free BuyMeAGoddie page and start receiving support with UPI.",
};

export default function SignupPage() {
  return <SignupForm />;
}
