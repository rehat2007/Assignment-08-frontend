"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Camera, Heart, MapPin, Search, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "photo", label: "Photo Studio" },
  { value: "film", label: "Film Stage" },
  { value: "podcast", label: "Podcast Lounge" },
  { value: "music", label: "Music Suite" },
  { value: "workshop", label: "Workshop" },
];

const SORTS = [
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const STUDIOS = [
  {
    slug: "cyc-wall-loft",
    name: "Cyc Wall Loft",
    category: "photo",
    location: "Gulshan 2, Dhaka",
    rating: 4.9,
    price: 85,
    gradient: "bg-linear-to-br from-[#f49a72] via-[#ef7d84] to-[#8f5cf1]",
  },
  {
    slug: "pink-paper-portrait",
    name: "Pink Paper Portrait Studio",
    category: "photo",
    location: "Mirpur DOHS, Dhaka",
    rating: 4.8,
    price: 60,
    gradient: "bg-linear-to-br from-[#f49a72] via-[#ec7b95] to-[#7b5cf1]",
  },
  {
    slug: "north-sound-stage",
    name: "North Sound Stage",
    category: "film",
    location: "Banani, Dhaka",
    rating: 4.7,
    price: 120,
    gradient: "bg-linear-to-br from-[#8fb2f9] via-[#8a79f2] to-[#4c3ea8]",
  },
  {
    slug: "rooftop-podcast-lounge",
    name: "Rooftop Podcast Lounge",
    category: "podcast",
    location: "Dhanmondi, Dhaka",
    rating: 4.6,
    price: 45,
    gradient: "bg-linear-to-br from-[#77d8b4] via-[#53b98c] to-[#2d6a74]",
  },
  {
    slug: "blue-note-suite",
    name: "Blue Note Suite",
    category: "music",
    location: "Uttara Sector 7, Dhaka",
    rating: 4.9,
    price: 75,
    gradient: "bg-linear-to-br from-[#a9c5f7] via-[#7f8ef5] to-[#38306e]",
  },
  {
    slug: "clay-makers-workshop",
    name: "Clay Makers Workshop",
    category: "workshop",
    location: "Mohammadpur, Dhaka",
    rating: 4.5,
    price: 35,
    gradient: "bg-linear-to-br from-[#f5c98a] via-[#e79a6f] to-[#9c4f6e]",
  },
];

function categoryLabel(category) {
  return FILTERS.find((filter) => filter.value === category)?.label ?? category;
}

function StudioCard({ studio, isFavorite, onToggleFavorite }) {
  const { slug, name, category, location, rating, price, gradient } = studio;

  return (
    <article className="overflow-hidden rounded-xl bg-card">
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

        <Camera className="size-16 text-white" strokeWidth={2.25} aria-hidden="true" />

        <span className="bg-[#40201a]/80 absolute top-4 left-4 grid h-7 place-items-center rounded-md px-2.5 text-xs font-bold text-brand">
          {categoryLabel(category)}
        </span>

        <button
          type="button"
          aria-pressed={isFavorite}
          aria-label={
            isFavorite ? "Remove from favorites" : "Save to favorites"
          }
          onClick={() => onToggleFavorite(slug)}
          className="bg-background/80 absolute top-4 right-4 grid size-9 place-items-center rounded-full text-white transition-colors outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Heart
            className={cn("size-4", isFavorite && "fill-brand text-brand")}
          />
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

        <div className="flex items-center justify-between gap-3">
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

export default function StudiosPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("rating");
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

  const studios = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = STUDIOS.filter((studio) => {
      const matchesCategory = category === "all" || studio.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${studio.name} ${studio.location}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    switch (sort) {
      case "price-asc":
        return filtered.toSorted((a, b) => a.price - b.price);
      case "price-desc":
        return filtered.toSorted((a, b) => b.price - a.price);
      default:
        return filtered.toSorted((a, b) => b.rating - a.rating);
    }
  }, [query, category, sort]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase">
        Explore Studios
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        Every space , one grid
      </h1>
      <p className="text-muted-foreground mt-3">
        Search by name or neighborhood, narrow by category and sort by rating
        or hourly rate.
      </p>

      {/* Search + sort */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search
            className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <label htmlFor="studio-search" className="sr-only">
            Search studios or locations
          </label>
          <input
            id="studio-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search studios or locations"
            className="bg-card h-11 w-full rounded-xl border border-border pr-4 pl-11 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
          />
        </div>

        <label htmlFor="studio-sort" className="sr-only">
          Sort studios
        </label>
        <select
          id="studio-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="bg-card h-11 rounded-xl border border-border px-3 text-sm font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:w-56"
        >
          {SORTS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Category chips */}
      <div className="mt-5 flex flex-wrap gap-3" role="group" aria-label="Filter by category">
        {FILTERS.map(({ value, label }) => {
          const isActive = category === value;

          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setCategory(value)}
              className={cn(
                "h-9 rounded-full border px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive
                  ? "border-transparent bg-white font-bold text-[#17171c]"
                  : "bg-card border-border hover:bg-accent/50"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <p className="text-muted-foreground mt-5 text-sm" role="status">
        {studios.length} {studios.length === 1 ? "studio" : "studios"} found
      </p>

      <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <li key={studio.slug}>
            <StudioCard
              studio={studio}
              isFavorite={favorites.has(studio.slug)}
              onToggleFavorite={toggleFavorite}
            />
          </li>
        ))}
      </ul>

      {studios.length === 0 && (
        <p className="text-muted-foreground mt-4 text-sm">
          No studios match your filters yet — try a different search.
        </p>
      )}
    </main>
  );
}
