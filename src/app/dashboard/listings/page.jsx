"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import StudioArt from "@/components/studio-art";
import { useAuthGuard } from "@/lib/auth-guard";
import { apiFetch } from "@/lib/api";
import { categoryLabel } from "@/lib/studios";
import { cn } from "cn";

export default function ListingsPage() {
  const { user, isPending } = useAuthGuard("/dashboard/listings");
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const controller = new AbortController();

    apiFetch("/host/listings", { signal: controller.signal })
      .then((data) => setListings(data.studios ?? []))
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

  async function deleteListing() {
    if (!pendingDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await apiFetch(`/studios/${pendingDelete._id ?? pendingDelete.slug}`, {
        method: "DELETE",
      });
      setListings((current) =>
        current.filter((studio) => studio._id !== pendingDelete._id)
      );
      toast.success("Studio deleted.");
      setPendingDelete(null);
    } catch (requestError) {
      setError(requestError.message);
      toast.error(requestError.message);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isPending || !user) {
    return null;
  }

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
            {isLoading ? "Loading your listings…" : `${listings.length} ${listings.length === 1 ? "listing" : "listings"}`} under{" "}
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

      {error && (
        <p
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mt-6 rounded-xl border px-4 py-3 text-sm"
        >
          {error}
        </p>
      )}

      {/* Listings table */}
      {isLoading ? (
        <div className="border-border bg-card mt-8 h-64 animate-pulse rounded-2xl border" />
      ) : listings.length > 0 ? (
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
                  key={studio._id ?? studio.slug}
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
                      {Number(studio.rating ?? 0).toFixed(1)}
                      <Star
                        className="fill-star text-star size-3.5"
                        aria-hidden="true"
                      />
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/register-host?edit=${studio._id}`}
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
          if (!open && !isDeleting) setPendingDelete(null);
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
                disabled={isDeleting}
                className="border-border flex h-10 cursor-pointer items-center rounded-full border px-5 text-sm font-bold outline-none transition-colors hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
              >
                Cancel
              </AlertDialog.Close>
              <button
                type="button"
                disabled={isDeleting}
                onClick={deleteListing}
                className="bg-destructive/15 text-destructive flex h-10 cursor-pointer items-center rounded-full px-5 text-sm font-bold outline-none transition-colors hover:bg-destructive/25 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </main>
  );
}
