"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import StudioArt from "@/components/studio-art";
import { useAuthGuard } from "@/lib/auth-guard";
import { STUDIOS, categoryLabel } from "@/lib/studios";
import { cn } from "cn";

export default function ListingsPage() {
  const { user, isPending } = useAuthGuard("/dashboard/listings");
  // deletions are local until DELETE /api/studios/[id] exists.
  const [removedSlugs, setRemovedSlugs] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);

  function deleteListing() {
    // TODO: DELETE /api/studios/[id] + toast like the reference.
    if (!pendingDelete) return;

    setRemovedSlugs((current) => [...current, pendingDelete.slug]);
  }

  if (isPending || !user) {
    return null;
  }

  const listings = STUDIOS.filter(
    (studio) =>
      studio.host.ownerEmail === user.email &&
      !removedSlugs.includes(studio.slug)
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-brand-strong text-xs font-bold tracking-[0.2em] uppercase">
            Host dashboard
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            My studio listings
          </h1>
          <p className="text-muted-foreground mt-3">
            {listings.length}{" "}
            {listings.length === 1 ? "listing" : "listings"} under{" "}
            {user.email}
          </p>
        </div>

        <Link
          href="/register-host"
          className={cn(
            buttonVariants(),
            // Host CTA stays flat — no lift/glow.
            "bg-brand h-12 shrink-0 cursor-pointer rounded-full px-6 text-white shadow-sm hover:bg-brand/90 hover:translate-y-0! hover:shadow-none!"
          )}
        >
          <Plus data-icon="inline-start" />
          Add New Studio
        </Link>
      </div>

      {/* Listings table */}
      {listings.length > 0 ? (
        <div className="border-border bg-card mt-8 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-border border-b">
                {["Studio", "Category", "Rate", "Rating", "Actions"].map(
                  (label, index) => (
                    <th
                      key={label}
                      scope="col"
                      className={cn(
                        "text-muted-foreground px-6 py-4 text-xs font-bold tracking-[0.12em] uppercase",
                        // Rates/actions keep their row alignment on mobile too.
                        index >= 3 && "text-center"
                      )}
                    >
                      {label}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {listings.map((studio) => (
                <tr
                  key={studio.slug}
                  className="border-border border-b last:border-0"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <StudioArt
                        studio={studio}
                        className="size-14 shrink-0 rounded-xl"
                        iconClassName="size-5"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-bold">{studio.name}</p>
                        <p className="text-muted-foreground truncate text-sm">
                          {studio.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    {categoryLabel(studio.category)}
                  </td>
                  <td className="px-6 py-5 font-bold">
                    ${studio.price}
                    <span className="text-muted-foreground text-sm font-normal">
                      {" "}
                      /hr
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="flex items-center justify-center gap-1.5 text-sm font-bold">
                      {studio.rating.toFixed(1)}
                      <Star
                        className="fill-star text-star size-3.5"
                        aria-hidden="true"
                      />
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href="/register-host"
                        className="bg-soft text-soft-foreground flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-bold outline-none transition-colors hover:bg-brand/40 focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Update
                      </Link>

                      <button
                        type="button"
                        onClick={() => setPendingDelete(studio)}
                        className="border-border flex h-9 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-bold outline-none transition-colors hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="border-border bg-card text-muted-foreground mt-8 rounded-2xl border px-6 py-10 text-center text-sm">
          No listings yet — add your first studio to start taking bookings.
        </p>
      )}

      {/* Delete confirmation */}
      <AlertDialog.Root
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="bg-black/60 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <AlertDialog.Popup className="border-border bg-card fixed top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <AlertDialog.Title className="text-xl font-bold tracking-tight">
              Delete this studio?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {pendingDelete?.name} will be removed from your listings, along
              with its pending booking requests. This cannot be undone.
            </AlertDialog.Description>

            <div className="mt-6 flex justify-end gap-2.5">
              <AlertDialog.Close
                className="border-border flex h-10 cursor-pointer items-center rounded-full border px-5 text-sm font-bold outline-none transition-colors hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Cancel
              </AlertDialog.Close>
              <AlertDialog.Close
                onClick={deleteListing}
                className="bg-destructive/15 text-destructive flex h-10 cursor-pointer items-center rounded-full px-5 text-sm font-bold outline-none transition-colors hover:bg-destructive/25 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Delete
              </AlertDialog.Close>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </main>
  );
}
