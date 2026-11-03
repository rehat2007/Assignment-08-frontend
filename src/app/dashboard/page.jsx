"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthGuard } from "@/lib/auth-guard";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  // Auth gate: like the reference, the dashboard is private — guests are
  // sent to login and returned here afterwards.
  const { user, isPending } = useAuthGuard("/dashboard");
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const controller = new AbortController();

    apiFetch("/host/stats", { signal: controller.signal })
      .then(setStats)
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [user?.id]);

  if (isPending || !user) {
    return null;
  }

  const firstName = user.name?.trim().split(/\s+/)[0] || "there";
  const cards = [
    { label: "My listings", value: stats?.listings, href: "/dashboard/listings" },
    {
      label: "Pending bookings",
      value: stats?.bookings?.pending,
      href: "/dashboard/bookings",
    },
    {
      label: "Confirmed bookings",
      value: stats?.bookings?.confirmed,
      href: "/dashboard/bookings",
    },
    { label: "Saved studios", value: stats?.savedStudios, href: "/studios" },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-brand-strong text-xs font-bold tracking-[0.2em] uppercase">
        Dashboard
      </p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Hello, {firstName}
      </h1>
      <p className="text-muted-foreground mt-3">
        Your listings and bookings at a glance.
      </p>

      {error && (
        <p
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mt-6 rounded-xl border px-4 py-3 text-sm"
        >
          {error}
        </p>
      )}

      <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="border-border bg-card rounded-2xl border p-6 outline-none transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-lift focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <dd className="text-3xl font-bold tracking-tight">
              {isLoading && value === undefined ? "—" : (value ?? 0)}
            </dd>
            <dt className="text-muted-foreground mt-1.5 text-sm">{label}</dt>
          </Link>
        ))}
      </dl>
    </main>
  );
}
