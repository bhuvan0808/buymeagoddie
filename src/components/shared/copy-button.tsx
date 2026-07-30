"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * Copies `value` to the clipboard with visual + toast feedback.
 */
export function CopyButton({
  value,
  label = "Copy",
  toastMessage = "Copied to clipboard",
  variant = "outline",
  size = "sm",
  showLabel = true,
  ...props
}: {
  value: string;
  label?: string;
  toastMessage?: string;
  showLabel?: boolean;
} & Omit<ButtonProps, "onClick" | "children">) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(toastMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy. Select and copy manually.");
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      aria-label={showLabel ? undefined : label}
      {...props}
    >
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      {showLabel ? (copied ? "Copied" : label) : null}
    </Button>
  );
}
