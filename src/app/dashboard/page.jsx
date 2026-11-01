"use client";

import { useEffect } from "react";
import { useAuthGuard } from "@/lib/auth-guard";
import { STUDIOS } from "@/lib/studios";
import { useWishlist } from "@/lib/wishlist";

// TODO: replace with real counts from GET /api/bookings once it exists.
const PENDING_BOOKINGS = 1;
const CONFIRMED_BOOKINGS = 1;

export default function DashboardPage() {
  // Auth gate: like the reference, the dashboard is private — guests are
  // sent to login and returned here afterwards.
  const { user, isPending } = useAuthGuard("/dashboard");
  const wishlist = useWishlist();

  if (isPending || !user) {
    return null;
  }

  const firstName = user.name?.trim().split(/\s+/)[0] || "there";
  const listingCount = STUDIOS.filter(
    (studio) => studio.host.ownerEmail === user.email
  ).length;

  const stats = [
    { label: "My listings", value: listingCount },
    { label: "Pending bookings", value: PENDING_BOOKINGS },
    { label: "Confirmed bookings", value: CONFIRMED_BOOKINGS },
    { label: "Saved studios", value: wishlist.length },
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

      <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="border-border bg-card rounded-2xl border p-6"
          >
            <dd className="text-3xl font-bold tracking-tight">{value}</dd>
            <dt className="text-muted-foreground mt-1.5 text-sm">{label}</dt>
          </div>
        ))}
      </dl>
    </main>
  );
}
