"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Loader2,
  PartyPopper,
  X,
} from "lucide-react";

import { CopyButton } from "@/components/shared/copy-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  checkUsernameAvailability,
  completeOnboarding,
} from "@/features/onboarding/actions";
import {
  COMING_SOON_PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
} from "@/features/payments/registry";
import { createClient } from "@/lib/supabase/client";
import { BIO_MAX_LENGTH, ROUTES } from "@/lib/constants";
import { siteConfig } from "@/lib/site";
import {
  displayNameSchema,
  usernameSchema,
} from "@/lib/validation/profile";
import { cn, getInitials } from "@/lib/utils";

const STEPS = ["Country", "Profile", "Payment", "Done"] as const;

type WizardState = {
  country: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string | null;
  provider: string;
  identifier: string;
};

type Availability =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available" }
  | { status: "unavailable"; reason: string };

const stepMotion = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

export function OnboardingWizard({
  userId,
  initialName,
  initialAvatarUrl,
}: {
  userId: string;
  initialName: string;
  initialAvatarUrl: string | null;
}) {
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [availability, setAvailability] = useState<Availability>({
    status: "idle",
  });
  const [state, setState] = useState<WizardState>({
    country: "IN",
    name: initialName,
    username: "",
    bio: "",
    avatarUrl: initialAvatarUrl,
    provider: DEFAULT_PAYMENT_METHOD.id,
    identifier: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live username availability, debounced.
  useEffect(() => {
    const candidate = state.username;
    if (!candidate) {
      setAvailability({ status: "idle" });
      return;
    }
    const parsed = usernameSchema.safeParse(candidate);
    if (!parsed.success) {
      setAvailability({
        status: "unavailable",
        reason: parsed.error.issues[0]!.message,
      });
      return;
    }
    setAvailability({ status: "checking" });
    const timer = setTimeout(async () => {
      const result = await checkUsernameAvailability(parsed.data);
      setAvailability(
        result.available
          ? { status: "available" }
          : {
              status: "unavailable",
              reason: result.reason ?? "Unavailable.",
            },
      );
    }, 450);
    return () => clearTimeout(timer);
  }, [state.username]);

  const identifierError = useMemo(() => {
    if (!state.identifier) return null;
    return DEFAULT_PAYMENT_METHOD.validateIdentifier(state.identifier);
  }, [state.identifier]);

  const previewUri = useMemo(() => {
    if (!state.identifier || identifierError) return null;
    return DEFAULT_PAYMENT_METHOD.buildPaymentUri({
      identifier: state.identifier,
      payeeName: state.name || "Creator",
    });
  }, [state.identifier, identifierError, state.name]);

  const profileValid =
    displayNameSchema.safeParse(state.name).success &&
    availability.status === "available" &&
    state.bio.length <= BIO_MAX_LENGTH;

  async function handleAvatarUpload(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2MB.");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${userId}/avatar-${Date.now()}.${extension}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setState((prev) => ({ ...prev, avatarUrl: data.publicUrl }));
    } catch {
      toast.error("Upload failed. Try a different image.");
    } finally {
      setUploading(false);
    }
  }

  function handleFinish() {
    startTransition(async () => {
      const result = await completeOnboarding(state);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setStep(3);
    });
  }

  return (
    <div className="w-full max-w-xl">
      {/* Progress */}
      <ol
        aria-label="Onboarding progress"
        className="mb-10 flex items-center justify-center gap-2"
      >
        {STEPS.map((label, index) => (
          <li key={label} className="flex items-center gap-2">
            <span
              aria-current={index === step ? "step" : undefined}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-all",
                index < step
                  ? "bg-gradient-brand text-white"
                  : index === step
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "glass text-muted-foreground",
              )}
            >
              {index < step ? <Check className="size-4" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                "hidden text-sm sm:block",
                index === step ? "font-medium" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 ? (
              <span aria-hidden className="mx-1 h-px w-6 bg-border" />
            ) : null}
          </li>
        ))}
      </ol>

      <div className="glass-card overflow-hidden rounded-3xl p-8 sm:p-10">
        <AnimatePresence mode="wait">
          {/* STEP 1 — Country */}
          {step === 0 ? (
            <motion.div key="country" {...stepMotion} className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Where do you create from?</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  This decides which instant payment rail your page uses.
                </p>
              </div>

              <button
                type="button"
                aria-pressed={state.country === "IN"}
                onClick={() => setState((prev) => ({ ...prev, country: "IN" }))}
                className={cn(
                  "focus-ring flex cursor-pointer items-center justify-between rounded-2xl border p-5 text-left transition-all",
                  state.country === "IN"
                    ? "border-primary bg-primary/10 glow-ring"
                    : "border-border hover:border-primary/40",
                )}
              >
                <span className="flex items-center gap-4">
                  <span className="text-3xl" aria-hidden>
                    🇮🇳
                  </span>
                  <span>
                    <span className="block font-semibold">India</span>
                    <span className="block text-sm text-muted-foreground">
                      Instant payments over UPI
                    </span>
                  </span>
                </span>
                {state.country === "IN" ? (
                  <Check className="size-5 text-primary" aria-hidden />
                ) : null}
              </button>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  More countries coming soon
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {COMING_SOON_PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      aria-disabled
                      className="flex items-center gap-2 rounded-xl border border-dashed border-border/70 px-3 py-2.5 opacity-60"
                    >
                      <span aria-hidden>{method.flag}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-medium">
                          {method.countryName}
                        </span>
                        <span className="block text-[10px] text-muted-foreground">
                          {method.name}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                variant="gradient"
                disabled={state.country !== "IN"}
                onClick={() => setStep(1)}
              >
                Continue
                <ArrowRight aria-hidden />
              </Button>
            </motion.div>
          ) : null}

          {/* STEP 2 — Profile */}
          {step === 1 ? (
            <motion.div key="profile" {...stepMotion} className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Build your profile</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  This is what supporters see when they open your page.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="focus-ring group relative rounded-full"
                  aria-label="Upload profile photo"
                >
                  <Avatar className="size-20">
                    {state.avatarUrl ? (
                      <AvatarImage src={state.avatarUrl} alt="" />
                    ) : null}
                    <AvatarFallback className="text-xl">
                      {getInitials(state.name || "You")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    {uploading ? (
                      <Loader2 className="size-5 animate-spin text-white" aria-hidden />
                    ) : (
                      <Camera className="size-5 text-white" aria-hidden />
                    )}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleAvatarUpload(file);
                  }}
                />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Profile photo</p>
                  <p>PNG, JPG or WebP. Max 2MB.</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="wizard-name">Name</Label>
                <Input
                  id="wizard-name"
                  placeholder="Your display name"
                  value={state.name}
                  maxLength={60}
                  onChange={(event) =>
                    setState((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="wizard-username">Username</Label>
                <div className="relative">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                  >
                    buymeagoddie.com/
                  </span>
                  <Input
                    id="wizard-username"
                    placeholder="you"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="pl-[9.4rem] font-mono lowercase"
                    value={state.username}
                    maxLength={30}
                    aria-describedby="username-status"
                    aria-invalid={availability.status === "unavailable"}
                    onChange={(event) =>
                      setState((prev) => ({
                        ...prev,
                        username: event.target.value.toLowerCase(),
                      }))
                    }
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    {availability.status === "checking" ? (
                      <Loader2
                        className="size-4 animate-spin text-muted-foreground"
                        aria-hidden
                      />
                    ) : availability.status === "available" ? (
                      <Check className="size-4 text-emerald-500" aria-hidden />
                    ) : availability.status === "unavailable" ? (
                      <X className="size-4 text-destructive" aria-hidden />
                    ) : null}
                  </span>
                </div>
                <p
                  id="username-status"
                  role="status"
                  className={cn(
                    "text-xs",
                    availability.status === "unavailable"
                      ? "text-destructive"
                      : availability.status === "available"
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                  )}
                >
                  {availability.status === "available"
                    ? "Available — it's yours."
                    : availability.status === "unavailable"
                      ? availability.reason
                      : "Lowercase letters, numbers, and hyphens."}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="wizard-bio">
                  Bio{" "}
                  <span className="font-normal text-muted-foreground">
                    ({state.bio.length}/{BIO_MAX_LENGTH})
                  </span>
                </Label>
                <Textarea
                  id="wizard-bio"
                  placeholder="Tell supporters what you create…"
                  value={state.bio}
                  maxLength={BIO_MAX_LENGTH}
                  onChange={(event) =>
                    setState((prev) => ({ ...prev, bio: event.target.value }))
                  }
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(0)}>
                  <ArrowLeft aria-hidden />
                  Back
                </Button>
                <Button
                  size="lg"
                  variant="gradient"
                  className="flex-1"
                  disabled={!profileValid}
                  onClick={() => setStep(2)}
                >
                  Continue
                  <ArrowRight aria-hidden />
                </Button>
              </div>
            </motion.div>
          ) : null}

          {/* STEP 3 — Payment */}
          {step === 2 ? (
            <motion.div key="payment" {...stepMotion} className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Add your UPI ID</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Supporters pay this ID directly. We never touch the money.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="wizard-upi">
                  {DEFAULT_PAYMENT_METHOD.identifierLabel}
                </Label>
                <Input
                  id="wizard-upi"
                  placeholder={DEFAULT_PAYMENT_METHOD.identifierPlaceholder}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="font-mono"
                  value={state.identifier}
                  aria-invalid={!!identifierError}
                  aria-describedby="upi-help"
                  onChange={(event) =>
                    setState((prev) => ({
                      ...prev,
                      identifier: event.target.value.trim(),
                    }))
                  }
                />
                <p
                  id="upi-help"
                  className={cn(
                    "text-xs",
                    identifierError ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {identifierError ?? DEFAULT_PAYMENT_METHOD.identifierHelp}
                </p>
              </div>

              {previewUri ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-5 rounded-2xl border border-border p-5"
                >
                  <div className="rounded-xl bg-white p-2.5">
                    <QRCodeSVG
                      value={previewUri}
                      size={104}
                      marginSize={1}
                      aria-label="Preview of your payment QR code"
                    />
                  </div>
                  <div className="text-sm">
                    <p className="flex items-center gap-1.5 font-medium">
                      <Check className="size-4 text-emerald-500" aria-hidden />
                      QR generated automatically
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      This code opens any UPI app with your details pre-filled.
                    </p>
                  </div>
                </motion.div>
              ) : null}

              <div className="rounded-xl bg-muted/60 p-4 text-xs text-muted-foreground">
                🔒 We only store your UPI ID. We will never ask for your UPI
                PIN, OTP, bank password, or card details.
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  <ArrowLeft aria-hidden />
                  Back
                </Button>
                <Button
                  size="lg"
                  variant="gradient"
                  className="flex-1"
                  disabled={!previewUri}
                  loading={pending}
                  onClick={handleFinish}
                >
                  Create my page
                  <ArrowRight aria-hidden />
                </Button>
              </div>
            </motion.div>
          ) : null}

          {/* STEP 4 — Complete */}
          {step === 3 ? (
            <motion.div
              key="done"
              {...stepMotion}
              className="flex flex-col items-center gap-6 text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                className="bg-gradient-brand flex size-16 items-center justify-center rounded-full text-white shadow-xl shadow-brand-violet/40"
              >
                <PartyPopper className="size-8" aria-hidden />
              </motion.span>
              <div>
                <h1 className="text-2xl font-bold">Your page is live! 🎉</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Share it anywhere — supporters can start paying you right now.
                </p>
              </div>

              <div className="glass flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4">
                <span className="truncate font-mono text-sm">
                  {siteConfig.url.replace(/^https?:\/\//, "")}/{state.username}
                </span>
                <CopyButton
                  value={`${siteConfig.url}/${state.username}`}
                  toastMessage="Profile link copied"
                />
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <Button variant="outline" size="lg" className="flex-1" asChild>
                  <Link href={ROUTES.profile(state.username)} target="_blank">
                    View my page
                  </Link>
                </Button>
                <Button variant="gradient" size="lg" className="flex-1" asChild>
                  <Link href={ROUTES.dashboard}>Open dashboard</Link>
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
