"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { setNextUrl } from "@/lib/session-redirect";
import { cn } from "cn";

export function HostCta({
  className,
  title = "Own a studio that sits empty?",
  description = "List it in ten minutes and set your own hourly rate.",
  ctaLabel = "Host Your Space",
  ctaHref = "/register-host",
  requiresAuth,
  ...props
}) {
  const { data, isPending } = authClient.useSession();
  const signedIn = Boolean(data?.user);

  // Only the host-listing flow needs an account; the public CTAs (e.g. the
  // About page's "Explore Studios") pass their own href and stay ungated.
  const gated = requiresAuth ?? ctaHref === "/register-host";

  function handleClick() {
    // Guests go to login first — remember where they meant to end up.
    if (gated && !signedIn) setNextUrl(ctaHref);
  }

  return (
    <section
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      <div className="bg-brand flex flex-col items-start justify-between gap-6 rounded-3xl px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          {description && <p className="mt-3 text-white/85">{description}</p>}
        </div>

        {isPending ? (
          /* Invisible while the session resolves — never flash the wrong link. */
          <span
            aria-hidden="true"
            className="h-12 w-44 shrink-0 rounded-full"
          />
        ) : (
          <Link
            href={gated && !signedIn ? "/login" : ctaHref}
            onClick={handleClick}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              /* Stays flat — no lift/glow on the Host CTA. */
              "h-12 shrink-0 rounded-full border-transparent bg-white px-8 text-base font-bold text-[#17171c] hover:bg-white/90 shadow-sm hover:translate-y-0! hover:shadow-none!"
            )}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

export default HostCta;
