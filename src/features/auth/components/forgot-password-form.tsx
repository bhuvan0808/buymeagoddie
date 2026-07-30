"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendPasswordReset } from "@/features/auth/actions";
import { ROUTES } from "@/lib/constants";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validation/auth";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await sendPasswordReset(values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="bg-gradient-brand flex size-12 items-center justify-center rounded-full text-white">
          <MailCheck className="size-6" aria-hidden />
        </span>
        <h1 className="text-xl font-bold">Check your inbox</h1>
        <p className="text-sm text-muted-foreground">
          If that email has an account, a password reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p role="alert" className="text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <Button type="submit" size="lg" loading={pending}>
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          href={ROUTES.login}
          className="focus-ring rounded font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
