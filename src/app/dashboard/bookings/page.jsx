"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import StudioArt from "@/components/studio-art";
import { useAuthGuard } from "@/lib/auth-guard";
import { getStudioBySlug } from "@/lib/studios";
import { cn } from "cn";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES = {
  pending: "bg-amber-500/15 text-amber-400",
  confirmed: "bg-emerald-500/15 text-emerald-500",
  completed: "bg-secondary text-muted-foreground",
  cancelled: "bg-rose-500/15 text-rose-400",
};

// Mock reservation list; GET /api/bookings replaces this when wired.
const INITIAL_BOOKINGS = [
  {
    id: "bk-104",
    studioSlug: "blackbox-sound-stage",
    date: "Wed, Nov 4, 2026",
    time: "10:00 - 14:00",
    hours: 4,
    status: "pending",
  },
  {
    id: "bk-101",
    studioSlug: "reverb-room-recording-suite",
    date: "Mon, Nov 2, 2026",
    time: "14:00 - 18:00",
    hours: 4,
    status: "confirmed",
  },
  {
    id: "bk-095",
    studioSlug: "cyc-wall-loft",
    date: "Thu, Oct 22, 2026",
    time: "09:00 - 12:00",
    hours: 3,
    status: "completed",
  },
  {
    id: "bk-090",
    studioSlug: "pink-paper-portrait",
    date: "Wed, Oct 28, 2026",
    time: "16:00 - 18:00",
    hours: 2,
    status: "cancelled",
  },
];

function downloadInvoice(booking, studio) {
  const studioTotal = booking.hours * studio.price;
  const receipt = [
    "StudioSpace — booking receipt",
    "================================",
    `Studio: ${studio.name} (${studio.location})`,
    `Date: ${booking.date}`,
    `Time: ${booking.time} (${booking.hours} hrs)`,
    "",
    `Studio time: ${booking.hours} × $${studio.price} = $${studioTotal}`,
    `Security deposit: $${studio.deposit} (refunded after checkout)`,
    `Total: $${studioTotal + studio.deposit}`,
    "",
    "Thank you for booking with StudioSpace.",
  ].join("\n");

  const url = URL.createObjectURL(new Blob([receipt], { type: "text/plain" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `receipt-${booking.studioSlug}-${booking.date.replace(/,\s?/g, "-").replace(/\s+/g, "-")}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
  // TODO: swap for the real receipt endpoint (GET /api/bookings/[id]/receipt).
}

export default function BookingsPage() {
  const { user, isPending } = useAuthGuard("/dashboard/bookings");
  // Status changes are local until PATCH /api/bookings/[id] exists.
  const [statusOverrides, setStatusOverrides] = useState({});
  const [filter, setFilter] = useState("all");

  const bookings = useMemo(
    () =>
      INITIAL_BOOKINGS.map((booking) => ({
        ...booking,
        status: statusOverrides[booking.id] ?? booking.status,
      })),
    [statusOverrides]
  );

  const visible = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === filter),
    [bookings, filter]
  );

  if (isPending || !user) {
    return null;
  }

  function cancelBooking(id) {
    // TODO: PATCH /api/bookings/[id] { status: "cancelled" } + toast.
    setStatusOverrides((current) => ({ ...current, [id]: "cancelled" }));
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <p className="text-brand-strong text-xs font-bold tracking-[0.2em] uppercase">
        Your reservations
      </p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        My bookings
      </h1>
      <p className="text-muted-foreground mt-3">
        Track requests, cancel pending slots and download receipts for
        confirmed shoots.
      </p>

      {/* Status filter pills */}
      <div
        className="mt-8 flex flex-wrap gap-3"
        role="group"
        aria-label="Filter bookings by status"
      >
        {FILTERS.map(({ value, label }) => {
          const isActive = filter === value;

          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(value)}
              className={cn(
                "h-10 cursor-pointer rounded-full border px-5 text-sm font-semibold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 hover:-translate-y-px hover:shadow-hover",
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

      {/* Booking cards */}
      <ul className="mt-6 space-y-4">
        {visible.map((booking) => {
          const studio = getStudioBySlug(booking.studioSlug);
          const total = booking.hours * studio.price + studio.deposit;

          return (
            <li key={booking.id}>
              <article className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-5 sm:flex-row sm:items-center">
                <StudioArt
                  studio={studio}
                  className="size-16 shrink-0 self-start rounded-xl sm:size-18 sm:self-auto"
                  iconClassName="size-6"
                />

                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
                      STATUS_STYLES[booking.status]
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-current"
                    />
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>

                  <h2 className="pt-2 text-lg font-bold tracking-tight">
                    {studio.name}
                  </h2>
                  <p className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                      {booking.time} ({booking.hours} hrs)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                      {studio.location}
                    </span>
                  </p>
                </div>

                <div className="flex shrink-0 flex-row-reverse items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-end sm:gap-1">
                  <p className="text-2xl font-bold tracking-tight">${total}</p>
                  <p className="text-muted-foreground text-xs">
                    incl. ${studio.deposit} deposit
                  </p>

                  <div className="pt-2">
                    {booking.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => cancelBooking(booking.id)}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-10 w-full cursor-pointer rounded-full px-5 text-sm font-bold sm:w-auto"
                        )}
                      >
                        Cancel Booking
                      </button>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        type="button"
                        onClick={() => downloadInvoice(booking, studio)}
                        className="bg-soft text-soft-foreground flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-bold outline-none transition-colors hover:bg-brand/25 focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
                      >
                        <FileText className="size-4" aria-hidden="true" />
                        Invoice
                      </button>
                    )}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p className="border-border bg-card text-muted-foreground mt-6 rounded-2xl border px-6 py-10 text-center text-sm">
          No bookings in this state yet.
        </p>
      )}
    </main>
  );
}
