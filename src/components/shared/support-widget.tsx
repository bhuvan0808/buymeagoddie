"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, Heart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGoodie } from "@/features/payments/goodies";
import { upi } from "@/features/payments/providers/upi";
import { siteConfig } from "@/lib/site";
import { customAmountSchema } from "@/lib/validation/profile";
import { cn, formatCurrency } from "@/lib/utils";

const PRESETS = [50, 100, 250];

/**
 * Floating "keep us free" widget, present on every page. Opens a small
 * glass panel where anyone can send a direct UPI payment to the platform —
 * deep link on mobile, scannable QR on desktop. Same rails as creator
 * pages: the money goes straight to the UPI ID, never through a gateway.
 */
export function SupportWidget() {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(PRESETS[1]);
  const [custom, setCustom] = useState("");
  const [showQr, setShowQr] = useState(false);

  const amount = useMemo(() => {
    if (custom) {
      const parsed = customAmountSchema.safeParse(custom);
      return parsed.success ? parsed.data : null;
    }
    return selected;
  }, [custom, selected]);

  const paymentUri = useMemo(
    () =>
      upi.buildPaymentUri({
        identifier: siteConfig.supportUpiId,
        payeeName: siteConfig.name,
        amount: amount ?? undefined,
        note: "Keep BuyMeAGoddie free",
      }),
    [amount],
  );

  function handleSend() {
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = paymentUri;
    } else {
      setShowQr(true);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            role="dialog"
            aria-label="Support BuyMeAGoddie"
            className="glass-card w-[19.5rem] rounded-3xl bg-popover/90 p-5 shadow-2xl"
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <h2 className="font-display text-base font-semibold">
                Keep BuyMeAGoddie free 💜
              </h2>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setShowQr(false);
                }}
                aria-label="Close support panel"
                className="focus-ring -mr-1 -mt-1 rounded-full p-1.5 text-muted-foreground hover:bg-foreground/10"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Zero fees means we run on supporters like you. Every rupee goes
              straight to our UPI — no middleman, ever.
            </p>

            {showQr ? (
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-2xl bg-white p-3">
                  <QRCodeSVG
                    value={paymentUri}
                    size={168}
                    marginSize={1}
                    aria-label="UPI QR code to support BuyMeAGoddie"
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Scan with any UPI app
                  {amount ? ` to send ${formatCurrency(amount, upi.currency)}` : ""} to{" "}
                  <code className="font-mono">{siteConfig.supportUpiId}</code>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQr(false)}
                  className="text-muted-foreground"
                >
                  Change amount
                </Button>
              </div>
            ) : (
              <>
                <div
                  role="group"
                  aria-label="Choose an amount"
                  className="mb-3 flex gap-2"
                >
                  {PRESETS.map((preset) => {
                    const active = selected === preset && !custom;
                    const goodie = getGoodie(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={active}
                        aria-label={`₹${preset} — gift ${goodie.label}`}
                        onClick={() => {
                          setSelected(preset);
                          setCustom("");
                        }}
                        className={cn(
                          "focus-ring flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-2xl border px-3 py-2 transition-all active:scale-95",
                          active
                            ? "bg-gradient-brand border-transparent text-white shadow-lg"
                            : "border-border text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span aria-hidden className="text-lg leading-none">
                          {goodie.emoji}
                        </span>
                        <span className="text-sm font-semibold">₹{preset}</span>
                      </button>
                    );
                  })}
                </div>
                <label htmlFor="support-custom-amount" className="sr-only">
                  Custom amount in rupees
                </label>
                <Input
                  id="support-custom-amount"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  placeholder="Custom amount (₹)"
                  value={custom}
                  onChange={(event) => {
                    setCustom(event.target.value);
                    setSelected(null);
                  }}
                  className="mb-3 h-10 rounded-full text-center"
                />
                <Button
                  variant="gradient"
                  className="w-full"
                  disabled={!amount}
                  onClick={handleSend}
                >
                  {amount
                    ? `Gift us ${getGoodie(amount).emoji} ${getGoodie(amount).label} · ${formatCurrency(amount, upi.currency)}`
                    : "Send via UPI"}
                  <ArrowRight aria-hidden />
                </Button>
                <p className="mt-2.5 text-center text-[10px] text-muted-foreground/70">
                  Direct to {siteConfig.supportUpiId} · 100% optional, 100%
                  appreciated
                </p>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={
          open ? "Close support panel" : "Support BuyMeAGoddie — keep us free"
        }
        initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        whileHover={reducedMotion ? undefined : { scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="focus-ring bg-gradient-brand group flex cursor-pointer items-center gap-2 rounded-full py-3 pl-3.5 pr-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_-6px] shadow-brand-violet/60 sm:pr-5"
      >
        <Heart
          className={cn("size-5 fill-current", !reducedMotion && "animate-pulse-glow")}
          aria-hidden
        />
        <span className="hidden sm:inline">
          {open ? "Maybe later" : "Keep us free 💜"}
        </span>
      </motion.button>
    </div>
  );
}
