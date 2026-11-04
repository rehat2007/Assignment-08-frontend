"use client";

import { Check, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

function SuccessIcon() {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
      <Check className="size-5" strokeWidth={2.5} aria-hidden="true" />
    </span>
  );
}

function ErrorIcon() {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-rose-500/15 text-rose-400">
      <X className="size-5" strokeWidth={2.5} aria-hidden="true" />
    </span>
  );
}

export function Toaster(props) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme ?? "dark"}
      position="top-center"
      offset={{ top: 88 }}
      mobileOffset={{ top: 88, left: 16, right: 16 }}
      gap={12}
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-[390px] max-w-[calc(100vw-2rem)] items-center gap-4 rounded-2xl border bg-[#0b0d0c] p-5 text-white shadow-[0_10px_40px_rgba(0,0,0,0.45)]",
          content: "flex min-w-0 flex-1 flex-col gap-1",
          title:
            "text-[15px] leading-snug font-bold tracking-[-0.01em] text-white",
          description: "text-sm leading-snug text-[#9ca3af]!",
          icon: "m-0 flex shrink-0",
          success: "border-emerald-400/80",
          error: "border-rose-400/70",
        },
      }}
      style={{
        "--width": "390px",
      }}
      {...props}
    />
  );
}
