"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/features/auth/actions";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validation/auth";

export function ResetPasswordForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  function onSubmit(values: ResetPasswordInput) {
    startTransition(async () => {
      const result = await updatePassword(values);
      if (result && !result.ok) toast.error(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Choose a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;re signed in — set a new password to finish.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!form.formState.errors.password}
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p role="alert" className="text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!form.formState.errors.confirm}
            {...form.register("confirm")}
          />
          {form.formState.errors.confirm ? (
            <p role="alert" className="text-xs text-destructive">
              {form.formState.errors.confirm.message}
            </p>
          ) : null}
        </div>
        <Button type="submit" size="lg" loading={pending}>
          Update password
        </Button>
      </form>
    </div>
  );
}
