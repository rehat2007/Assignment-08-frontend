"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Camera,
  Film,
  Heart,
  MapPin,
  Mic,
  Music,
  Palette,
  Star,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { setNextUrl } from "@/lib/session-redirect";
import { categoryLabel } from "@/lib/studios";
import { toggleWishlist, useWishlist } from "@/lib/wishlist";
import { cn } from "cn";

const CATEGORY_ICONS = {
  photo: Camera,
  film: Film,
  podcast: Mic,
  music: Music,
  workshop: Palette,
};

export function StudioCard({ studio }) {
  const { slug, name, category, location, rating, price, gradient } = studio;
  const Icon = CATEGORY_ICONS[category] ?? Camera;
  const router = useRouter();
  const pathname = usePathname();
  const { data } = authClient.useSession();
  const user = data?.user;
  const wishlist = useWishlist(user?.id);
  const [isToggling, setIsToggling] = useState(false);
  const isSaved = wishlist.includes(slug);

  async function handleWishlist() {
    if (!user) {
      setNextUrl(pathname);
      router.push("/login");
      return;
    }

    setIsToggling(true);
    try {
      await toggleWishlist(studio);
    } catch {
      // The optimistic store already rolled back; keep the UI quiet here.
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <article className="bg-card border-border relative overflow-hidden rounded-xl border transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift">
      {/* Stretched link: the whole card opens its detail page. Sits under the
          heart button (z-10), which stays independently clickable. */}
      <Link
        href={`/studios/${slug}`}
        aria-label={`View details for ${name}`}
        className="absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      />

      {/* Visual header */}
      <div
        className={cn(
          "relative flex aspect-[7/5] items-center justify-center overflow-hidden",
          gradient
        )}
      >
        {studio.image ? (
          /* eslint-disable-next-line @next/next/no-img-element -- host uploads are arbitrary external URLs, not configured Next image hosts */
          <img
            src={studio.image}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <>
            <span
              aria-hidden="true"
              className="absolute -top-16 -right-12 size-60 rounded-full bg-white/15"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-10 -left-8 size-40 rounded-full bg-white/10"
            />

            <Icon
              className="relative size-16 text-white"
              strokeWidth={2.25}
              aria-hidden="true"
            />
          </>
        )}

        <span className="bg-soft text-soft-foreground absolute top-4 left-4 grid h-7 place-items-center rounded-full px-3 text-xs font-bold">
          {categoryLabel(category)}
        </span>

        <button
          type="button"
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
          disabled={isToggling}
          onClick={handleWishlist}
          className="bg-background/80 absolute top-4 right-4 z-10 grid size-9 cursor-pointer place-items-center rounded-full text-white transition-all outline-none hover:bg-background hover:-translate-y-px hover:shadow-hover focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-70"
        >
          <Heart
            className={cn(
              "size-4",
              isSaved && "fill-brand text-brand",
              isToggling && "animate-pulse"
            )}
          />
        </button>
      </div>

      {/* Details */}
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg leading-snug font-bold tracking-tight">
            {name}
          </h3>
          <span className="bg-secondary flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold">
            <Star
              className="fill-star text-star size-3.5"
              aria-hidden="true"
            />
            {Number(rating ?? 0).toFixed(1)}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {location}
        </p>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-2xl font-bold tracking-tight">
            ${price}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / hr
            </span>
          </p>
          {/* The stretched card link handles navigation; this is just the
              visual affordance. */}
          <span
            aria-hidden="true"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-10 rounded-xl bg-brand px-4 text-white"
            )}
          >
            View Details
          </span>
        </div>
      </div>
    </article>
  );
}

export default StudioCard;
