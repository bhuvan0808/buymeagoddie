import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "focus-ring flex min-h-24 w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm shadow-sm backdrop-blur-sm transition-colors",
        "placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
