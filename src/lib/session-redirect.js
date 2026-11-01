/**
 * Guest-intent redirect: pages/components that require an account store the
 * path the visitor was heading to, and the login card sends them there after
 * signing in — same flow as the reference prototype's `nextUrl`.
 */
const NEXT_URL_KEY = "studiospace.nextUrl";

export function setNextUrl(path) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(NEXT_URL_KEY, path);
}

export function takeNextUrl() {
  if (typeof window === "undefined") return null;

  const next = window.sessionStorage.getItem(NEXT_URL_KEY);
  window.sessionStorage.removeItem(NEXT_URL_KEY);

  return next && next.startsWith("/") && next !== "//" ? next : null;
}
