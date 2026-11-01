"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import StudioCard from "@/components/studio-card";
import { STUDIO_CATEGORIES, STUDIOS } from "@/lib/studios";
import { cn } from "cn";

const SORTS = [
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

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
      <div
        className="mt-5 flex flex-wrap gap-3"
        role="group"
        aria-label="Filter by category"
      >
        {STUDIO_CATEGORIES.map(({ value, label }) => {
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
