import Link from "next/link";
import { Aperture } from "lucide-react";
import { cn } from "cn";

export function Logo({ className, ...props }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "bg-brand grid size-9 shrink-0 place-items-center rounded-xl"
        )}
      >
        <Aperture className="size-5 text-white" />
      </span>
      <span className="text-lg font-bold tracking-tight">StudioSpace</span>
    </Link>
  );
}

export default Logo;
