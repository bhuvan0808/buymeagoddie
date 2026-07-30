"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { ExternalLink, QrCode, Share2 } from "lucide-react";
import { toast } from "sonner";

import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { siteConfig } from "@/lib/site";

/**
 * The "your page is live" card: URL + copy / share / QR actions.
 * The QR here encodes the page URL (for posters and stream overlays), not
 * the payment link — the payment QR lives on the page itself.
 */
export function ProfileUrlCard({ username }: { username: string }) {
  const [qrOpen, setQrOpen] = useState(false);
  const url = `${siteConfig.url}/${username}`;
  const displayUrl = url.replace(/^https?:\/\//, "");

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My BuyMeAGoddie page", url });
        return;
      } catch {
        // fall through
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Profile link copied");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your page</CardTitle>
        <CardDescription>
          Share this link anywhere your supporters are.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="glass flex items-center justify-between gap-3 rounded-xl px-4 py-3">
          <span className="truncate font-mono text-sm">{displayUrl}</span>
          <Link
            href={`/${username}`}
            target="_blank"
            aria-label="Open your page in a new tab"
            className="focus-ring shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={url} toastMessage="Profile link copied" />
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 aria-hidden />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => setQrOpen(true)}>
            <QrCode aria-hidden />
            Generate QR
          </Button>
        </div>
      </CardContent>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Page QR code</DialogTitle>
            <DialogDescription>
              Scanning opens {displayUrl}. Perfect for posters, slides, and
              stream overlays.
            </DialogDescription>
          </DialogHeader>
          <div className="mx-auto rounded-2xl bg-white p-4">
            <QRCodeSVG
              value={url}
              size={220}
              marginSize={1}
              aria-label={`QR code linking to ${displayUrl}`}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
