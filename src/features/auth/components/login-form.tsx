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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleButton } from "@/features/auth/components/google-button";
import { sendMagicLink, signInWithPassword } from "@/features/auth/actions";
import { ROUTES } from "@/lib/constants";
import {
  loginSchema,
  magicLinkSchema,
  type LoginInput,
  type MagicLinkInput,
} from "@/lib/validation/auth";

export function LoginForm() {
  const [pending, startTransition] = useTransition();
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const passwordForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const magicForm = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  function onPasswordSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await signInWithPassword(values);
      if (result && !result.ok) toast.error(result.error);
    });
  }

  function onMagicSubmit(values: MagicLinkInput) {
    startTransition(async () => {
      const result = await sendMagicLink(values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setMagicLinkSent(true);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage your support page.
        </p>
      </div>

      <GoogleButton />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          or
        </span>
        <Separator className="flex-1" />
      </div>

      <Tabs defaultValue="password">
        <TabsList className="w-full">
          <TabsTrigger value="password" className="flex-1">
            Password
          </TabsTrigger>
          <TabsTrigger value="magic" className="flex-1">
            Magic Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!passwordForm.formState.errors.email}
                {...passwordForm.register("email")}
              />
              {passwordForm.formState.errors.email ? (
                <p role="alert" className="text-xs text-destructive">
                  {passwordForm.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link
                  href={ROUTES.forgotPassword}
                  className="focus-ring rounded text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!passwordForm.formState.errors.password}
                {...passwordForm.register("password")}
              />
              {passwordForm.formState.errors.password ? (
                <p role="alert" className="text-xs text-destructive">
                  {passwordForm.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" size="lg" loading={pending}>
              Sign in
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="magic">
          {magicLinkSent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="bg-gradient-brand flex size-12 items-center justify-center rounded-full text-white">
                <MailCheck className="size-6" aria-hidden />
              </span>
              <p className="font-medium">Magic link sent</p>
              <p className="text-sm text-muted-foreground">
                Check your inbox and tap the link to sign in instantly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={magicForm.handleSubmit(onMagicSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="magic-email">Email</Label>
                <Input
                  id="magic-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={!!magicForm.formState.errors.email}
                  {...magicForm.register("email")}
                />
                {magicForm.formState.errors.email ? (
                  <p role="alert" className="text-xs text-destructive">
                    {magicForm.formState.errors.email.message}
                  </p>
                ) : null}
              </div>
              <Button type="submit" size="lg" loading={pending}>
                Send magic link
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link
          href={ROUTES.signup}
          className="focus-ring rounded font-medium text-primary hover:underline"
        >
          Create your page
        </Link>
      </p>
    </div>
  );
}
