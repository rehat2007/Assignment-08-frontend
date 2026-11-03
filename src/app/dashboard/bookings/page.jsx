"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Check, Clock, FileText, MapPin, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import StudioArt from "@/components/studio-art";
import { apiFetch, apiUrl } from "@/lib/api";
import { useAuthGuard } from "@/lib/auth-guard";
import { formatBookingDate, formatHour } from "@/lib/format";
import { cn } from "cn";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const ROLE_TABS = [
  { value: "customer", label: "My bookings" },
  { value: "host", label: "Incoming requests" },
];

const STATUS_STYLES = {
  pending: "bg-amber-500/15 text-amber-400",
  confirmed: "bg-emerald-500/15 text-emerald-500",
  completed: "bg-secondary text-muted-foreground",
  cancelled: "bg-rose-500/15 text-rose-400",
};

function statusLabel(status) {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
}

function bookingStudio(booking) {
  const snapshot = booking.studioSnapshot ?? {};

  return {
    name: snapshot.name ?? "Studio",
    slug: snapshot.slug,
    category: snapshot.category ?? "photo",
    location: snapshot.location ?? "",
    gradient:
      snapshot.gradient ??
      "bg-linear-to-br from-[#f49a72] via-[#ef7d84] to-[#8f5cf1]",
    image: snapshot.image ?? null,
  };
}

export default function BookingsPage() {
  const { user, isPending } = useAuthGuard("/dashboard/bookings");
  const [role, setRole] = useState("customer");
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const controller = new AbortController();

    apiFetch(role === "host" ? "/bookings?role=host" : "/bookings", {
      signal: controller.signal,
    })
      .then((data) => setBookings(data.bookings ?? []))
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [user?.id, role]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === filter),
    [bookings, filter]
  );

  function changeRole(nextRole) {
    setRole(nextRole);
    setIsLoading(true);
    setError(null);
    setFilter("all");
  }

  async function changeStatus(id, status) {
    setActionId(id);
    setError(null);

    try {
      const { booking } = await apiFetch(`/bookings/${id}`, {
        method: "PATCH",
        body: { status },
      });

      setBookings((current) =>
        current.map((item) => (item._id === id ? booking : item))
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActionId(null);
    }
  }

  async function downloadReceipt(booking) {
    setActionId(booking._id);
    setError(null);

    try {
      const response = await fetch(apiUrl(`/bookings/${booking._id}/receipt`), {
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Receipt failed (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `receipt-${booking.studioSnapshot?.slug ?? "studio"}-${booking.date}.txt`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActionId(null);
    }
  }

  if (isPending || !user) {
    return null;
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
        Track requests, confirm or decline incoming bookings, cancel pending
        slots and download receipts.
      </p>

      {/* Role tabs */}
      <div
        className="border-border mt-8 inline-flex rounded-full border p-1"
        role="group"
        aria-label="Booking role"
      >
        {ROLE_TABS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={role === value}
            onClick={() => changeRole(value)}
            className={cn(
              "h-9 cursor-pointer rounded-full px-5 text-sm font-bold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              role === value
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Status filter pills */}
      <div
        className="mt-4 flex flex-wrap gap-3"
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

      {error && (
        <p
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mt-6 rounded-xl border px-4 py-3 text-sm"
        >
          {error}
        </p>
      )}

      {/* Booking cards */}
      {isLoading ? (
        <div className="mt-6 space-y-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="border-border bg-card h-36 animate-pulse rounded-2xl border"
            />
          ))}
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {visible.map((booking) => {
            const studio = bookingStudio(booking);
            const busy = actionId === booking._id;

            return (
              <li key={booking._id}>
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
                        STATUS_STYLES[booking.status] ??
                          "bg-secondary text-muted-foreground"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-current"
                      />
                      {statusLabel(booking.status)}
                    </span>

                    <h2 className="pt-2 text-lg font-bold tracking-tight">
                      {studio.slug ? (
                        <Link
                          href={`/studios/${studio.slug}`}
                          className="rounded-sm outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          {studio.name}
                        </Link>
                      ) : (
                        studio.name
                      )}
                    </h2>
                    <p className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
                        {formatBookingDate(booking.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                        {formatHour(booking.startHour)}–{formatHour(booking.endHour)} (
                        {booking.hours} hrs)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                        {studio.location || "Location shared after booking"}
                      </span>
                    </p>
                    {role === "host" && booking.userName && (
                      <p className="text-muted-foreground pt-1.5 text-xs">
                        Requested by {booking.userName}
                        {booking.userEmail ? ` · ${booking.userEmail}` : ""}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-row-reverse items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-end sm:gap-1">
                    <p className="text-2xl font-bold tracking-tight">
                      ${booking.total}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      incl. ${booking.deposit} deposit
                    </p>

                    <div className="flex flex-wrap justify-end gap-2 pt-2">
                      {role === "customer" &&
                        (booking.status === "pending" ||
                          booking.status === "confirmed") && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => changeStatus(booking._id, "cancelled")}
                            className={cn(
                              buttonVariants({ variant: "outline" }),
                              "h-9 cursor-pointer rounded-full px-4 text-xs font-bold disabled:cursor-wait disabled:opacity-50"
                            )}
                          >
                            Cancel Booking
                          </button>
                        )}

                      {role === "host" && booking.status === "pending" && (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => changeStatus(booking._id, "confirmed")}
                            className="bg-brand flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-xs font-bold text-white outline-none transition-colors hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-50"
                          >
                            <Check className="size-3.5" aria-hidden="true" />
                            Confirm
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => changeStatus(booking._id, "declined")}
                            className={cn(
                              buttonVariants({ variant: "outline" }),
                              "h-9 cursor-pointer rounded-full px-4 text-xs font-bold disabled:cursor-wait disabled:opacity-50"
                            )}
                          >
                            <X className="size-3.5" aria-hidden="true" />
                            Decline
                          </button>
                        </>
                      )}

                      {role === "host" && booking.status === "confirmed" && (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => changeStatus(booking._id, "completed")}
                            className="bg-brand flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-xs font-bold text-white outline-none transition-colors hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-50"
                          >
                            <Check className="size-3.5" aria-hidden="true" />
                            Mark completed
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => changeStatus(booking._id, "cancelled")}
                            className={cn(
                              buttonVariants({ variant: "outline" }),
                              "h-9 cursor-pointer rounded-full px-4 text-xs font-bold disabled:cursor-wait disabled:opacity-50"
                            )}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {(booking.status === "confirmed" ||
                        booking.status === "completed") && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => downloadReceipt(booking)}
                          className="bg-soft text-soft-foreground flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-xs font-bold outline-none transition-colors hover:bg-brand/25 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-50"
                        >
                          <FileText className="size-3.5" aria-hidden="true" />
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
      )}

      {!isLoading && visible.length === 0 && (
        <p className="border-border bg-card text-muted-foreground mt-6 rounded-2xl border px-6 py-10 text-center text-sm">
          {bookings.length === 0
            ? role === "host"
              ? "No incoming booking requests yet."
              : "You have not booked a studio yet."
            : "No bookings in this state yet."}
        </p>
      )}
    </main>
  );
}
