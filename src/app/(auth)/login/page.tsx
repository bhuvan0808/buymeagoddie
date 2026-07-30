import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your BuyMeAGoddie creator page.",
};

export default function LoginPage() {
  return <LoginForm />;
}
