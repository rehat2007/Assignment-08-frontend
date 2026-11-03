"use client";

import { useEffect, useSyncExternalStore } from "react";
import { apiFetch } from "@/lib/api";

/**
 * Shared wishlist store backed by the Express API. `useWishlist` keeps the
 * public shape components already use (an array of studio slugs) while the
 * store privately maps slugs to Mongo studio ids for toggle requests.
 */
const EMPTY_LIST = [];

const listeners = new Set();
let snapshotList = EMPTY_LIST;
let idBySlug = new Map();
let inflight = null;

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function setList(next) {
  snapshotList = next;
  notify();
}

/** Fetch the signed-in member's saved studios. Guests should never call this. */
export async function refreshWishlist() {
  if (inflight) return inflight;

  inflight = apiFetch("/api/wishlist")
    .then(({ studios = [] }) => {
      idBySlug = new Map(studios.map((studio) => [studio.slug, studio._id]));
      setList(studios.map((studio) => studio.slug));
    })
    .catch(() => {
      // A 401 here just means the session ended; keep the current snapshot.
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/**
 * Toggle a studio by API document (preferred) or slug. Accepts a studio object
 * because the API keys wishlists by `studioId`, while the UI mostly uses slugs.
 */
export async function toggleWishlist(studio) {
  const slug = typeof studio === "string" ? studio : studio?.slug;
  const studioId =
    (typeof studio === "object" && studio?._id) || idBySlug.get(slug);

  if (!slug || !studioId) {
    throw new Error("This studio is not ready for the wishlist yet — refresh and try again.");
  }

  const previous = snapshotList;
  const wasSaved = previous.includes(slug);

  setList(
    wasSaved
      ? previous.filter((current) => current !== slug)
      : [...previous, slug]
  );

  try {
    const { wishlisted } = await apiFetch("/wishlist", {
      method: "POST",
      body: { studioId },
    });

    // Keep the snapshot authoritative if another tab changed it mid-flight.
    if (wishlisted !== !wasSaved) {
      setList(
        wishlisted
          ? [...new Set([...snapshotList, slug])]
          : snapshotList.filter((current) => current !== slug)
      );
    }

    if (wishlisted) idBySlug.set(slug, studioId);
    return wishlisted;
  } catch (error) {
    setList(previous);
    throw error;
  }
}

export function useWishlist(userId) {
  useEffect(() => {
    if (!userId) {
      // Signed out (or session still loading): hearts start empty and are
      // refilled by the API once the session resolves.
      idBySlug = new Map();
      setList(EMPTY_LIST);
      return;
    }

    refreshWishlist();
  }, [userId]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshotList;
}

function getServerSnapshot() {
  return EMPTY_LIST;
}
