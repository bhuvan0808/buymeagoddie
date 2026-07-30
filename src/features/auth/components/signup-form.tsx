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
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/features/auth/components/google-button";
import { signUpWithPassword } from "@/features/auth/actions";
import { ROUTES } from "@/lib/constants";
import { signupSchema, type SignupInput } from "@/lib/validation/auth";

export function SignupForm() {
  const [pending, startTransition] = useTransition();
  const [confirmationSent, setConfirmationSent] = useState(false);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: SignupInput) {
    startTransition(async () => {
      const result = await signUpWithPassword(values);
      if (result && !result.ok) {
        toast.error(result.error);
        return;
      }
      if (result?.ok && result.message) {
        setConfirmationSent(true);
      }
    });
  }

  if (confirmationSent) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="bg-gradient-brand flex size-12 items-center justify-center rounded-full text-white">
          <MailCheck className="size-6" aria-hidden />
        </span>
        <h1 className="text-xl font-bold">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to your inbox. Tap it and you&apos;ll be
          building your page in seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create your page</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Free forever. Live in under a minute.
        </p>
      </div>

      <GoogleButton label="Sign up with Google" />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          or
        </span>
        <Separator className="flex-1" />
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!form.formState.errors.password}
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p role="alert" className="text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" variant="gradient" size="lg" loading={pending}>
          Create account
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        By continuing you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="focus-ring rounded font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
