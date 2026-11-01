"use client";

import Link from "next/link";
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

export function StudioCard({ studio, isFavorite, onToggleFavorite }) {
  const { slug, name, category, location, rating, price, gradient } = studio;
  const Icon = studio.icon ?? CATEGORY_ICONS[category];
  // Cards with a wishlist owner (parent state) defer to it; standalone cards
  // manage their own heart via the shared local wishlist store.
  const wishlist = useWishlist();
  const isSaved = onToggleFavorite
    ? Boolean(isFavorite)
    : wishlist.includes(slug);
  const toggleFavorite = onToggleFavorite ?? toggleWishlist;

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

        <span className="bg-soft text-soft-foreground absolute top-4 left-4 grid h-7 place-items-center rounded-full px-3 text-xs font-bold">
          {categoryLabel(category)}
        </span>

        <button
          type="button"
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
          onClick={() => toggleFavorite(slug)}
          className="bg-background/80 absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full text-white transition-all outline-none hover:bg-background hover:-translate-y-px hover:shadow-hover focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Heart className={cn("size-4", isSaved && "fill-brand text-brand")} />
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
            {rating.toFixed(1)}
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
