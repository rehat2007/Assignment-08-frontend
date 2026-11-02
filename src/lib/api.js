/**
 * Base URL for the Express API.
 *
 * Browser: calls the same-origin `/api/proxy` path, which `next.config.mjs`
 * rewrites to the deployed API. Keeping browser calls same-origin means the
 * Better Auth cookie is sent with every request even when the frontend and API
 * are on different `*.vercel.app` domains (cookies cannot be shared across
 * those).
 *
 * Server components: call the API host directly through `API_PROXY_TARGET`
 * (or a local absolute URL); relative URLs cannot be fetched from the server.
 */
const configuredUrl = process.env.NEXT_PUBLIC_API_URL;

const trimTrailingSlashes = (value) => value?.replace(/\/+$/, "");
const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(
  configuredUrl ?? ""
);

// Never let a production build call localhost, even if a hosting dashboard
// still has an old local value in NEXT_PUBLIC_API_URL.
const usableClientUrl =
  configuredUrl && !(process.env.NODE_ENV === "production" && isLocalhost)
    ? configuredUrl
    : null;

const serverBase =
  trimTrailingSlashes(process.env.API_PROXY_TARGET) ||
  (configuredUrl?.startsWith("http") ? trimTrailingSlashes(configuredUrl) : null) ||
  "http://localhost:3001";

const clientBase = usableClientUrl || "/api/proxy";

export const API_BASE = typeof window === "undefined" ? serverBase : clientBase;

export async function apiFetch(path, { method = "GET", body, ...rest } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include", // sends better-auth.session_token to the API
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store", // dashboard data must never be cached
    ...rest,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(data?.error ?? `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}
