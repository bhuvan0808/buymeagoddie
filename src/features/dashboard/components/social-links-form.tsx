"use client";

import { useState, useTransition } from "react";
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
import { saveSocialLinks } from "@/features/dashboard/actions";
import { SocialIcon } from "@/features/profile/components/social-icons";
import { SOCIAL_PLATFORMS } from "@/lib/constants";
import { socialLinkSchema } from "@/lib/validation/profile";
import type { SocialLinkRow } from "@/types/database";

export function SocialLinksForm({ links }: { links: SocialLinkRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      SOCIAL_PLATFORMS.map((platform) => [
        platform.id,
        links.find((link) => link.platform === platform.id)?.url ?? "",
      ]),
    ),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSave() {
    const payload: { platform: string; url: string }[] = [];
    const nextErrors: Record<string, string> = {};

    for (const platform of SOCIAL_PLATFORMS) {
      const url = values[platform.id]?.trim();
      if (!url) continue;
      const parsed = socialLinkSchema.safeParse({ platform: platform.id, url });
      if (!parsed.success) {
        nextErrors[platform.id] = parsed.error.issues[0]!.message;
        continue;
      }
      payload.push(parsed.data);
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startTransition(async () => {
      const result = await saveSocialLinks(payload);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Links saved");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>
          Shown as icons under your name. Leave a field empty to hide it.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {SOCIAL_PLATFORMS.map((platform) => (
          <div key={platform.id} className="flex flex-col gap-2">
            <Label
              htmlFor={`link-${platform.id}`}
              className="flex items-center gap-2"
            >
              <SocialIcon
                platform={platform.id}
                className="size-4 text-muted-foreground"
              />
              {platform.label}
            </Label>
            <Input
              id={`link-${platform.id}`}
              type="url"
              inputMode="url"
              placeholder={`${platform.urlPrefix}you`}
              value={values[platform.id] ?? ""}
              aria-invalid={!!errors[platform.id]}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  [platform.id]: event.target.value,
                }))
              }
            />
            {errors[platform.id] ? (
              <p role="alert" className="text-xs text-destructive">
                {errors[platform.id]}
              </p>
            ) : null}
          </div>
        ))}
        <Button onClick={handleSave} loading={pending} className="self-start">
          Save links
        </Button>
      </CardContent>
    </Card>
  );
}
