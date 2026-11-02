"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { CalendarDays, Check, Clock, LoaderCircle, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatBookingDate, formatHour, todayISO } from "@/lib/format";
import { cn } from "cn";

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

export function BookingDialog({ studio, open, onOpenChange }) {
  const [date, setDate] = useState(todayISO());
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(11);
  const [availability, setAvailability] = useState(null);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  const minHours = availability?.minHours ?? studio.minHours ?? 1;
  const hours = endHour - startHour;
  const total = hours > 0 ? hours * studio.price + studio.deposit : 0;
  // Derived: availability belongs to the currently selected day only.
  const isLoadingAvailability =
    Boolean(date) &&
    !availabilityError &&
    (!availability || availability.date !== date);

  useEffect(() => {
    if (!open || !date) return;

    const controller = new AbortController();

    apiFetch(`/api/studios/${studio._id ?? studio.slug}/availability?date=${date}`, {
      signal: controller.signal,
    })
      .then(setAvailability)
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setAvailabilityError(requestError.message);
          setAvailability(null);
        }
      });

    return () => controller.abort();
  }, [open, date, refreshKey, studio._id, studio.slug]);

  const bookedSlots = availability?.bookedSlots ?? [];
  const overlap = bookedSlots.find(
    (slot) => startHour < slot.endHour && endHour > slot.startHour
  );
  const tooShort = hours < minHours;
  const invalidRange = endHour <= startHour;

  function handleOpenChange(nextOpen) {
    onOpenChange(nextOpen);

    if (nextOpen) {
      setAvailability(null);
      setAvailabilityError(null);
      return;
    }

    setBooking(null);
    setError(null);
    setStartHour(9);
    setEndHour(11);
  }

  function handleDateChange(value) {
    setDate(value);
    setAvailability(null);
    setAvailabilityError(null);
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!date) {
      setError("Pick a date first.");
      return;
    }
    if (invalidRange) {
      setError("The end time must be after the start time.");
      return;
    }
    if (tooShort) {
      setError(`This studio has a ${minHours}-hour minimum booking.`);
      return;
    }
    if (overlap) {
      setError("That time range overlaps an existing booking. Pick another slot.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await apiFetch("/api/bookings", {
        method: "POST",
        body: {
          ...(studio._id
            ? { studioId: studio._id }
            : { studioSlug: studio.slug }),
          date,
          startHour,
          endHour,
        },
      });

      setBooking(data.booking);
    } catch (requestError) {
      setError(requestError.message);

      if (requestError.status === 409) {
        setAvailability(null);
        setRefreshKey((current) => current + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="bg-black/60 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="border-border bg-card fixed top-1/2 left-1/2 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-6 outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
          {booking ? (
            <div>
              <span className="bg-brand/15 text-brand grid size-11 place-items-center rounded-full">
                <Check className="size-5" aria-hidden="true" />
              </span>
              <Dialog.Title className="mt-4 text-2xl font-bold tracking-tight">
                Booking request sent
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {studio.name} on {formatBookingDate(date)}, {formatHour(startHour)}
                –{formatHour(endHour)}. Your total is ${booking.total}; the host
                still needs to confirm.
              </Dialog.Description>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link
                  href="/dashboard/bookings"
                  className={cn(
                    buttonVariants(),
                    "bg-brand h-10 rounded-full px-5 text-white hover:bg-brand/90"
                  )}
                >
                  View my bookings
                </Link>
                <Dialog.Close
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 rounded-full px-5"
                  )}
                >
                  Keep browsing
                </Dialog.Close>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Dialog.Title className="text-2xl font-bold tracking-tight">
                    Book {studio.name}
                  </Dialog.Title>
                  <Dialog.Description className="text-muted-foreground mt-2 text-sm">
                    Pick a day and a time range. The API re-checks availability
                    before creating the request.
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="Close booking dialog"
                  className="text-muted-foreground hover:bg-accent/50 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <X className="size-4" aria-hidden="true" />
                </Dialog.Close>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="booking-date" className="block pb-2 text-sm font-bold">
                    Date
                  </label>
                  <div className="relative">
                    <CalendarDays
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="booking-date"
                      type="date"
                      min={todayISO()}
                      value={date}
                      onChange={(event) => handleDateChange(event.target.value)}
                      className="bg-card h-11 w-full rounded-lg border border-border pr-3.5 pl-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="booking-start" className="block pb-2 text-sm font-bold">
                      Start
                    </label>
                    <select
                      id="booking-start"
                      value={startHour}
                      onChange={(event) => {
                        setStartHour(Number(event.target.value));
                        setError(null);
                      }}
                      className="bg-card h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {HOURS.map((hour) => (
                        <option key={hour} value={hour}>
                          {formatHour(hour)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="booking-end" className="block pb-2 text-sm font-bold">
                      End
                    </label>
                    <select
                      id="booking-end"
                      value={endHour}
                      onChange={(event) => {
                        setEndHour(Number(event.target.value));
                        setError(null);
                      }}
                      className="bg-card h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {HOURS.map((hour) => (
                        <option key={hour + 1} value={hour + 1}>
                          {formatHour(hour + 1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-border bg-secondary/50 rounded-xl border px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">
                      {hours > 0 ? `${hours} hour${hours === 1 ? "" : "s"}` : "—"} × $
                      {studio.price}
                    </span>
                    <span className="font-bold">
                      {hours > 0 ? `$${hours * studio.price}` : "—"}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Security deposit</span>
                    <span className="font-bold">${studio.deposit}</span>
                  </div>
                  <div className="border-border mt-2 flex items-center justify-between gap-3 border-t pt-2">
                    <span className="font-bold">Total</span>
                    <span className="text-lg font-bold">${total}</span>
                  </div>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <Clock className="text-muted-foreground size-4" aria-hidden="true" />
                    Booked times
                  </p>
                  {isLoadingAvailability ? (
                    <p className="text-muted-foreground mt-1.5 flex items-center gap-2 text-sm">
                      <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
                      Checking availability…
                    </p>
                  ) : availabilityError ? (
                    <p className="text-destructive mt-1.5 text-sm">{availabilityError}</p>
                  ) : bookedSlots.length === 0 ? (
                    <p className="text-muted-foreground mt-1.5 text-sm">
                      This day is completely open.
                    </p>
                  ) : (
                    <ul className="text-muted-foreground mt-1.5 flex flex-wrap gap-2 text-sm">
                      {bookedSlots.map((slot) => (
                        <li
                          key={slot.bookingId}
                          className="bg-secondary rounded-full px-3 py-1"
                        >
                          {formatHour(slot.startHour)}–{formatHour(slot.endHour)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {error && (
                  <p
                    role="alert"
                    className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2.5 text-sm"
                  >
                    {error}
                  </p>
                )}
                {overlap && !error && (
                  <p className="text-destructive text-sm">
                    That range overlaps a booked slot. Pick another time.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isLoadingAvailability ||
                    Boolean(availabilityError) ||
                    Boolean(overlap) ||
                    invalidRange ||
                    tooShort
                  }
                  className={cn(
                    buttonVariants(),
                    "bg-brand h-11 w-full cursor-pointer rounded-full font-bold text-white hover:bg-brand/90 disabled:cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? "Requesting…" : `Request booking · $${total}`}
                </button>
                <p className="text-muted-foreground text-center text-xs">
                  You will not be charged until the host confirms your request.
                </p>
              </div>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default BookingDialog;
