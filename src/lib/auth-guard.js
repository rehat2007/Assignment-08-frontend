import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { setNextUrl } from "@/lib/session-redirect";

/**
 * Gate for private pages (dashboard, listings, bookings): guests are sent to
 * login and returned to `path` after signing in, matching the reference's
 * login-gated pages. Returns the session user plus a `isPending` flag so
 * callers can avoid flashing the gated layout before the session resolves.
 */
export function useAuthGuard(path) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  useEffect(() => {
    if (!isPending && !user) {
      setNextUrl(path);
      router.replace("/login");
    }
  }, [isPending, user, router, path]);

  return { user, isPending };
}
