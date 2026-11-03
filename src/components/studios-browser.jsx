"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import StudioCard from "@/components/studio-card";
import { apiFetch } from "@/lib/api";
import { STUDIO_CATEGORIES } from "@/lib/studios";
import { cn } from "cn";

const SORTS = [
  { value: "rating_desc", label: "Top rated" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

const PAGE_SIZE = 9;

export function StudiosBrowser({ initialCategory = "all", initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("rating_desc");
  const [page, setPage] = useState(1);
  const [studios, setStudios] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      sort,
      page: String(page),
      limit: String(PAGE_SIZE),
    });

    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);

    const timer = setTimeout(() => {
      setIsLoading(true);
      setError(null);

      apiFetch(`/studios?${params}`, { signal: controller.signal })
        .then((data) => {
          setStudios(data.studios ?? []);
          setMeta({
            total: data.total ?? 0,
            pages: data.pages ?? 1,
          });
        })
        .catch((requestError) => {
          if (requestError.name !== "AbortError") {
            setError(requestError.message);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, category, sort, page]);

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <p className="text-brand-strong text-xs font-bold tracking-[0.2em] uppercase">
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
            onChange={(event) => changeFilter(setQuery, event.target.value)}
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
          onChange={(event) => changeFilter(setSort, event.target.value)}
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
              onClick={() => changeFilter(setCategory, value)}
              className={cn(
                "h-9 rounded-full border px-4 text-sm font-semibold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 hover:-translate-y-px hover:shadow-hover",
                isActive
                  ? "border-transparent bg-foreground font-bold text-background"
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
        {isLoading
          ? "Loading studios…"
          : `${meta.total} ${meta.total === 1 ? "studio" : "studios"} found`}
      </p>

      {error ? (
        <p className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-xl border px-5 py-4 text-sm">
          {error}
        </p>
      ) : isLoading && studios.length === 0 ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <li
              key={index}
              className="border-border bg-card h-96 animate-pulse rounded-xl border"
            />
          ))}
        </ul>
      ) : (
        <ul
          className={cn(
            "mt-4 grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3",
            isLoading && "opacity-60"
          )}
        >
          {studios.map((studio) => (
            <li key={studio._id ?? studio.slug}>
              <StudioCard studio={studio} />
            </li>
          ))}
        </ul>
      )}

      {!error && !isLoading && studios.length === 0 && (
        <p className="text-muted-foreground mt-4 text-sm">
          No studios match your filters yet — try a different search.
        </p>
      )}

      {!error && meta.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1 || isLoading}
            className="border-border bg-card h-10 cursor-pointer rounded-full border px-5 text-sm font-bold outline-none transition-colors hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-muted-foreground text-sm">
            Page {page} of {meta.pages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(meta.pages, current + 1))
            }
            disabled={page >= meta.pages || isLoading}
            className="border-border bg-card h-10 cursor-pointer rounded-full border px-5 text-sm font-bold outline-none transition-colors hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

export default StudiosBrowser;
