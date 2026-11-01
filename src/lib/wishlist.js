"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared wishlist store, persisted per-browser in localStorage. Kept as a
 * tiny external store so any component (studio cards, detail page, dashboard
 * stat) stays in sync without prop drilling — the eventual /api/wishlist will
 * replace the localStorage side of this.
 */
const STORAGE_KEY = "studiospace.wishlist";
const EMPTY_LIST = [];

const listeners = new Set();
let snapshotList = EMPTY_LIST;

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

if (typeof window !== "undefined") {
  try {
    const raw = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]"
    );

    if (Array.isArray(raw)) {
      snapshotList = raw;
    }
  } catch {
    // keep EMPTY_LIST
  }

  // Keep tabs in sync.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;

    try {
      const raw = JSON.parse(event.newValue ?? "[]");
      snapshotList = Array.isArray(raw) && raw.length ? raw : EMPTY_LIST;
      notify();
    } catch {
      // ignore malformed storage writes
    }
  });
}

export function toggleWishlist(slug) {
  if (typeof window === "undefined") return;

  const next = snapshotList.includes(slug)
    ? snapshotList.filter((current) => current !== slug)
    : [...snapshotList, slug];

  snapshotList = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage may be unavailable; the in-memory list still works
  }

  notify();
}

export function useWishlist() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
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
