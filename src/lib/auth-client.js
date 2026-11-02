import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /**
   * Optional. When unset, Better Auth uses the current browser origin, which is
   * exactly what we want on Vercel (https://studiospace-theta.vercel.app).
   * Set NEXT_PUBLIC_APP_URL only if the auth server lives on another origin.
   */
  baseURL: process.env.NEXT_PUBLIC_APP_URL || undefined,
});
