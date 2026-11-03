"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import StudioCard from "@/components/studio-card";
import { apiFetch } from "@/lib/api";
import { cn } from "cn";

export function FeaturedStudios({ className, ...props }) {
  const [studios, setStudios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    apiFetch("/studios?sort=rating_desc&limit=6", {
      signal: controller.signal,
    })
      .then((data) => setStudios(data.studios ?? []))
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-brand-strong text-xs font-bold tracking-[0.2em] uppercase">
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
            "h-11 shrink-0 rounded-full border-foreground bg-transparent px-5 sm:self-auto"
          )}
        >
          View all studios
        </Link>
      </div>

      {error ? (
        <p className="border-border bg-card text-muted-foreground mt-8 rounded-xl border px-6 py-10 text-center text-sm">
          Could not load featured studios: {error}
        </p>
      ) : isLoading ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <li
              key={index}
              className="border-border bg-card h-96 animate-pulse rounded-xl border"
            />
          ))}
        </ul>
      ) : studios.length === 0 ? (
        <p className="border-border bg-card text-muted-foreground mt-8 rounded-xl border px-6 py-10 text-center text-sm">
          No studios are published yet.
        </p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <li key={studio._id ?? studio.slug}>
              <StudioCard studio={studio} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default FeaturedStudios;
