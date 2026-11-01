import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function HostCta({
  className,
  title = "Own a studio that sits empty?",
  description = "List it in ten minutes and set your own hourly rate.",
  ctaLabel = "Host Your Space",
  ctaHref = "/register-host",
  ...props
}) {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8", className)}
      {...props}
    >
      <div className="bg-brand flex flex-col items-start justify-between gap-6 rounded-3xl px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          {description && <p className="mt-3 text-white/85">{description}</p>}
        </div>

        <Link
          href={ctaHref}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-12 shrink-0 rounded-full border-transparent bg-white px-8 text-base font-bold text-[#17171c] hover:bg-white/90 shadow-sm"
          )}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

export default HostCta;
