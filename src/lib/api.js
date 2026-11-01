export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiFetch(path, { method = "GET", body, ...rest } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include", // sends better-auth.session_token to :3001
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",      // dashboard data must never be cached
    ...rest,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }
  return data;
}