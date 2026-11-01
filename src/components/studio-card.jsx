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
  const isSaved = Boolean(isFavorite);

  return (
    <article className="bg-card overflow-hidden rounded-xl">
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

        <span className="bg-[#40201a]/80 absolute top-4 left-4 grid h-7 place-items-center rounded-md px-2.5 text-xs font-bold text-brand">
          {categoryLabel(category)}
        </span>

        <button
          type="button"
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
          onClick={() => onToggleFavorite?.(slug)}
          className="bg-background/80 absolute top-4 right-4 grid size-9 place-items-center rounded-full text-white transition-colors outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Heart className={cn("size-4", isSaved && "fill-brand text-brand")} />
        </button>
      </div>

      {/* Details */}
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug font-bold tracking-tight">
            {name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-sm font-bold">
            <Star
              className="fill-[#f6a723] text-[#f6a723] size-4"
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
          <Link
            href={`/studios/${slug}`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-10 rounded-xl bg-brand px-4 text-white hover:bg-brand/90"
            )}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default StudioCard;
