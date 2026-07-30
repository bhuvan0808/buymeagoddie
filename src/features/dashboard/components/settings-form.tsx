"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updatePayment, updateSettings } from "@/features/dashboard/actions";
import { getPaymentMethod } from "@/features/payments/registry";
import type { ProfileThemeId } from "@/lib/constants";
import type { ProfileRow, SettingsRow } from "@/types/database";

const TOGGLES: {
  key: "show_qr" | "show_social_links" | "allow_custom_amount";
  label: string;
  description: string;
}[] = [
  {
    key: "show_qr",
    label: "Show QR code",
    description: "Let supporters open a scannable payment QR on your page.",
  },
  {
    key: "show_social_links",
    label: "Show social links",
    description: "Display your social icons under your bio.",
  },
  {
    key: "allow_custom_amount",
    label: "Allow custom amounts",
    description: "Supporters can type any amount, not just presets.",
  },
];

export function PageSettingsCard({ settings }: { settings: SettingsRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toggles, setToggles] = useState({
    show_qr: settings.show_qr,
    show_social_links: settings.show_social_links,
    allow_custom_amount: settings.allow_custom_amount,
  });

  function handleToggle(
    key: keyof typeof toggles,
    value: boolean,
  ) {
    const next = { ...toggles, [key]: value };
    setToggles(next);
    startTransition(async () => {
      const result = await updateSettings({
        ...next,
        theme: settings.theme as ProfileThemeId,
      });
      if (!result.ok) {
        setToggles(toggles);
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page options</CardTitle>
        <CardDescription>Control what appears on your page.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {TOGGLES.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor={`toggle-${key}`}>{label}</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            </div>
            <Switch
              id={`toggle-${key}`}
              checked={toggles[key]}
              disabled={pending}
              onCheckedChange={(value) => handleToggle(key, value)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PaymentCard({ profile }: { profile: ProfileRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [identifier, setIdentifier] = useState(
    profile.payment_identifier ?? "",
  );

  const method = getPaymentMethod(profile.payment_method ?? "upi")!;
  const error = useMemo(
    () => (identifier ? method.validateIdentifier(identifier) : null),
    [identifier, method],
  );
  const dirty = identifier !== (profile.payment_identifier ?? "");

  function handleSave() {
    startTransition(async () => {
      const result = await updatePayment({
        provider: method.id,
        identifier,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`${method.identifierLabel} updated`);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          {method.flag} {method.name} · payments land directly in your bank
          account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-upi">{method.identifierLabel}</Label>
          <Input
            id="settings-upi"
            className="font-mono"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={method.identifierPlaceholder}
            value={identifier}
            aria-invalid={!!error}
            onChange={(event) => setIdentifier(event.target.value.trim())}
          />
          <p
            className={
              error ? "text-xs text-destructive" : "text-xs text-muted-foreground"
            }
          >
            {error ?? method.identifierHelp}
          </p>
        </div>
        <Button
          onClick={handleSave}
          loading={pending}
          disabled={!dirty || !!error || !identifier}
          className="self-start"
        >
          Update {method.identifierLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
