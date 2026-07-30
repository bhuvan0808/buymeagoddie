"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Heart, QrCode, Share2 } from "lucide-react";
import { toast } from "sonner";

import { CopyButton } from "@/components/shared/copy-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getGoodie } from "@/features/payments/goodies";
import { getPaymentMethod } from "@/features/payments/registry";
import { SocialIcon } from "@/features/profile/components/social-icons";
import { PROFILE_THEME_STYLES } from "@/features/profile/theme-styles";
import type { ProfileCardData } from "@/features/profile/types";
import { customAmountSchema } from "@/lib/validation/profile";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

/**
 * The creator support card. Used on the public /{username} page (mode
 * "live"), in the landing demo, onboarding, and dashboard previews (mode
 * "preview" — payment taps show a hint instead of opening a UPI app).
 */
export function ProfileCard({
  data,
  mode = "live",
  className,
}: {
  data: ProfileCardData;
  mode?: "live" | "preview";
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [qrOpen, setQrOpen] = useState(false);

  const method = getPaymentMethod(data.provider);
  const themeStyle =
    PROFILE_THEME_STYLES[data.theme] ?? PROFILE_THEME_STYLES.midnight;

  const amount = useMemo(() => {
    if (customAmount) {
      const parsed = customAmountSchema.safeParse(customAmount);
      return parsed.success ? parsed.data : null;
    }
    return selectedAmount;
  }, [customAmount, selectedAmount]);

  const paymentUri = useMemo(() => {
    if (!method || method.status !== "active") return null;
    return method.buildPaymentUri({
      identifier: data.identifier,
      payeeName: data.name,
      amount: amount ?? undefined,
      note: `Support via BuyMeAGoddie`,
    });
  }, [method, data.identifier, data.name, amount]);

  function handleSupport() {
    if (mode === "preview") {
      toast("This is a preview — on your live page this opens the UPI app.", {
        icon: "✨",
      });
      return;
    }
    if (!paymentUri) return;

    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isMobile) {
      // Deep link straight into GPay / PhonePe / Paytm / BHIM.
      window.location.href = paymentUri;
    } else {
      // Desktop can't open upi:// — show a scannable QR instead.
      setQrOpen(true);
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}/${data.username}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Support ${data.name} on BuyMeAGoddie`,
          url,
        });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Profile link copied");
  }

  if (!method) return null;

  const dark = themeStyle.dark;

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-3xl border p-7 shadow-2xl backdrop-blur-2xl",
        dark
          ? "border-white/10 bg-white/[0.05] text-white shadow-black/40"
          : "border-black/5 bg-white/70 text-zinc-900 shadow-zinc-300/50",
        className,
      )}
    >
      {/* Accent glow behind the avatar */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r opacity-30 blur-3xl",
          themeStyle.accent,
        )}
      />

      <div className="relative flex flex-col items-center gap-4 text-center">
        <Avatar className="size-24 ring-2 ring-white/20">
          {data.avatarUrl ? (
            <AvatarImage src={data.avatarUrl} alt={`${data.name}'s avatar`} />
          ) : null}
          <AvatarFallback className="text-2xl">
            {getInitials(data.name || data.username)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-display text-2xl font-bold">{data.name}</h2>
          <p className={cn("text-sm", dark ? "text-white/50" : "text-zinc-500")}>
            @{data.username}
          </p>
        </div>

        {data.bio ? (
          <p
            className={cn(
              "max-w-sm text-sm leading-relaxed",
              dark ? "text-white/75" : "text-zinc-600",
            )}
          >
            {data.bio}
          </p>
        ) : null}

        {data.settings.show_social_links && data.socialLinks.length > 0 ? (
          <ul className="flex items-center gap-1">
            {data.socialLinks.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${data.name} on ${link.platform}`}
                  className={cn(
                    "focus-ring flex size-9 items-center justify-center rounded-full transition-colors",
                    dark
                      ? "text-white/60 hover:bg-white/10 hover:text-white"
                      : "text-zinc-500 hover:bg-black/5 hover:text-zinc-900",
                  )}
                >
                  <SocialIcon platform={link.platform} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Amount presets, each tied to a goodie */}
        <div
          role="group"
          aria-label="Choose a support amount"
          className="mt-2 flex w-full flex-wrap justify-center gap-2"
        >
          {method.presetAmounts.map((preset) => {
            const active = selectedAmount === preset && !customAmount;
            const goodie = getGoodie(preset);
            return (
              <button
                key={preset}
                type="button"
                aria-pressed={active}
                aria-label={`${formatCurrency(preset, method.currency)} — gift ${goodie.label}`}
                onClick={() => {
                  setSelectedAmount(preset);
                  setCustomAmount("");
                }}
                className={cn(
                  "focus-ring flex min-w-[4.2rem] cursor-pointer flex-col items-center gap-0.5 rounded-2xl border px-3.5 py-2.5 transition-all active:scale-95",
                  active
                    ? "border-transparent bg-gradient-to-r text-white shadow-lg " +
                        themeStyle.accent
                    : dark
                      ? "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                      : "border-black/10 bg-white text-zinc-700 hover:bg-zinc-50",
                )}
              >
                <span aria-hidden className="text-xl leading-none">
                  {goodie.emoji}
                </span>
                <span className="text-sm font-semibold">
                  {formatCurrency(preset, method.currency)}
                </span>
              </button>
            );
          })}
        </div>

        {data.settings.allow_custom_amount ? (
          <div className="w-full">
            <label htmlFor={`custom-amount-${data.username}`} className="sr-only">
              Custom amount in {method.currency}
            </label>
            <div className="relative">
              <span
                aria-hidden
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold",
                  dark ? "text-white/50" : "text-zinc-400",
                )}
              >
                {method.currencySymbol}
              </span>
              <Input
                id={`custom-amount-${data.username}`}
                type="number"
                inputMode="decimal"
                min={1}
                placeholder="Custom amount"
                value={customAmount}
                onChange={(event) => {
                  setCustomAmount(event.target.value);
                  setSelectedAmount(null);
                }}
                className={cn(
                  "h-11 rounded-full pl-9 text-center",
                  dark
                    ? "border-white/15 bg-white/5 text-white placeholder:text-white/40"
                    : "bg-white",
                )}
              />
            </div>
          </div>
        ) : null}

        {/* Live goodie indicator */}
        <AnimatePresence mode="wait">
          {amount ? (
            <motion.p
              key={getGoodie(amount).label}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              role="status"
              className={cn(
                "text-sm font-medium",
                dark ? "text-white/80" : "text-zinc-600",
              )}
            >
              You&apos;re gifting{" "}
              <span aria-hidden className="text-lg align-middle">
                {getGoodie(amount).emoji}
              </span>{" "}
              {getGoodie(amount).label}!
            </motion.p>
          ) : null}
        </AnimatePresence>

        {/* Primary action */}
        <Button
          size="xl"
          onClick={handleSupport}
          className={cn(
            "w-full bg-gradient-to-r text-white shadow-xl hover:brightness-110",
            themeStyle.accent,
          )}
        >
          <Heart className="fill-current" aria-hidden />
          {amount
            ? `Gift ${getGoodie(amount).emoji} for ${formatCurrency(amount, method.currency)}`
            : "Buy Me a Goddie"}
        </Button>

        {/* Secondary actions */}
        <div className="flex w-full items-center justify-center gap-2">
          {data.settings.show_qr ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQrOpen(true)}
              className={dark ? "text-white/70 hover:bg-white/10 hover:text-white" : ""}
            >
              <QrCode aria-hidden />
              QR Code
            </Button>
          ) : null}
          <CopyButton
            value={data.identifier}
            label={`Copy ${method.identifierLabel}`}
            toastMessage={`${method.identifierLabel} copied`}
            variant="ghost"
            className={dark ? "text-white/70 hover:bg-white/10 hover:text-white" : ""}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className={dark ? "text-white/70 hover:bg-white/10 hover:text-white" : ""}
          >
            <Share2 aria-hidden />
            Share
          </Button>
        </div>

        <p
          className={cn(
            "text-[11px]",
            dark ? "text-white/35" : "text-zinc-400",
          )}
        >
          Payments go directly to {data.name} via {method.name}. BuyMeAGoddie
          never holds your money.
        </p>
      </div>

      {/* Scan-to-pay dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Scan to support {data.name}</DialogTitle>
            <DialogDescription>
              Open any UPI app — Google Pay, PhonePe, Paytm, BHIM — and scan
              this code{amount ? ` to pay ${formatCurrency(amount, method.currency)}` : ""}.
            </DialogDescription>
          </DialogHeader>
          {paymentUri ? (
            <div className="mx-auto rounded-2xl bg-white p-4">
              <QRCodeSVG
                value={paymentUri}
                size={220}
                marginSize={1}
                aria-label={`UPI payment QR code for ${data.name}`}
              />
            </div>
          ) : null}
          <div className="flex items-center justify-center gap-2">
            <code className="rounded-lg bg-muted px-3 py-1.5 font-mono text-xs">
              {data.identifier}
            </code>
            <CopyButton value={data.identifier} showLabel={false} size="icon-sm" />
          </div>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
}
