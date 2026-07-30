"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={(resolvedTheme as ToasterProps["theme"]) ?? "dark"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "glass-card !rounded-2xl !border-border !bg-popover/90",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
