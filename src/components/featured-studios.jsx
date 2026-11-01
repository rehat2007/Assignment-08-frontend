"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import StudioCard from "@/components/studio-card";
import { STUDIOS } from "@/lib/studios";
import { cn } from "cn";

// Featured picks, matching the designed lineup (first three are the
// top-rated ones shown in the reference).
const FEATURED_SLUGS = [
  "cyc-wall-loft",
  "reverb-room-recording-suite",
  "blackbox-sound-stage",
  "blue-note-suite",
  "pink-paper-portrait",
  "north-sound-stage",
];

export function FeaturedStudios({ className, ...props }) {
  const [favorites, setFavorites] = useState(() => new Set());

  function toggleFavorite(slug) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  const featured = useMemo(
    () =>
      FEATURED_SLUGS.map((slug) => STUDIOS.find((s) => s.slug === slug)).filter(
        Boolean
      ),
    []
  );

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase">
            Featured Studios
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Top-rated spaces this month
          </h2>
          <p className="text-muted-foreground mt-3">
            Six of the highest-rated rooms, with transparent hourly pricing.
          </p>
        </div>

        <Link
          href="/studios"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 shrink-0 self-start rounded-full border-border bg-transparent px-5 sm:self-auto"
          )}
        >
          View all studios
        </Link>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((studio) => (
          <li key={studio.slug}>
            <StudioCard
              studio={studio}
              isFavorite={favorites.has(studio.slug)}
              onToggleFavorite={toggleFavorite}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FeaturedStudios;
