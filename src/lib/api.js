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

// Deployed Express API used by production builds when API_PROXY_TARGET is not
// set, so a Vercel deploy works without extra dashboard configuration.
const DEPLOYED_API = "https://assignment-08-backend-pi.vercel.app";

const trimTrailingSlashes = (value) => value?.replace(/\/+$/, "");
const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(
  configuredUrl ?? ""
);

// Never let a production build call localhost, even if a hosting dashboard
// still has an old local value in NEXT_PUBLIC_API_URL.
const usableClientUrl =
  configuredUrl && !(process.env.NODE_ENV === "production" && isLocalhost)
    ? trimTrailingSlashes(configuredUrl)
    : null;

const isProduction = process.env.NODE_ENV === "production";

const serverBase =
  trimTrailingSlashes(process.env.API_PROXY_TARGET) ||
  (isProduction ? DEPLOYED_API : null) ||
  (configuredUrl?.startsWith("http") ? trimTrailingSlashes(configuredUrl) : null) ||
  "http://localhost:3001";

const clientBase = usableClientUrl || "/api/proxy";

export const API_BASE = typeof window === "undefined" ? serverBase : clientBase;

/**
 * Build the Express `/api/...` path for the active base.
 *
 * Callers always pass a path relative to the API root (for example
 * `/studios`), never `/api/studios`:
 * - `/api/proxy` already inserts `/api` through the Next.js rewrite.
 * - A bare origin (server components or an absolute NEXT_PUBLIC_API_URL) does
 *   not, so the Express prefix has to be added here.
 * - A base that already ends in `/api` supplies the prefix itself.
 *
 * Leading `/api` is tolerated for older call sites, so a path can never end up
 * as `/api/proxy/api/...` or `/api/api/...`.
 */
function apiPath(path) {
  const relativePath = path.replace(/^\/api(?=\/|\?|$)/, "");
  return /\/api(\/proxy)?$/.test(API_BASE)
    ? relativePath
    : `/api${relativePath}`;
}

/** Absolute (or same-origin) URL for an Express API path. */
export function apiUrl(path) {
  return `${API_BASE}${apiPath(path)}`;
}

export async function apiFetch(path, { method = "GET", body, ...rest } = {}) {
  const res = await fetch(apiUrl(path), {
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
