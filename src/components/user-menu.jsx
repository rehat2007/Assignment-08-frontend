"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "@base-ui/react/menu";
import {
  LayoutDashboard,
  List,
  LogOut,
  Plus,
  Ticket,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "cn";

const MENU_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/register-host", label: "Add New Studio", icon: Plus },
  { href: "/dashboard/listings", label: "My Studio Listings", icon: List },
  { href: "/dashboard/bookings", label: "My Bookings", icon: Ticket },
];

function getInitials(name) {
  const parts = (name || "").trim().split(/\s+/);

  return (
    parts
      .slice(0, 2)
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase() || "U"
  );
}

const itemClass =
  "flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm font-semibold outline-none transition-colors hover:bg-accent/60 focus-visible:ring-3 focus-visible:ring-ring/50 data-[highlighted]:bg-accent/60";

/* Only real http(s) images are rendered; anything else falls back to initials. */
function getAvatarImage(imageUrl) {
  return /^https?:\/\/\S+$/.test(imageUrl ?? "") ? imageUrl : null;
}

export function UserMenu({ user, className }) {
  const router = useRouter();
  const avatarImage = getAvatarImage(user?.image);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
  }

  return (
    <Menu.Root className={className}>
      <Menu.Trigger
        aria-label="Open account menu"
        className="bg-brand size-10 shrink-0 cursor-pointer overflow-hidden rounded-full text-sm font-bold text-white outline-none transition-colors hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:ring-2 data-[popup-open]:ring-ring/40"
      >
        {avatarImage ? (
          /* eslint-disable-next-line @next/next/no-img-element -- avatars are arbitrary external URLs (imgbb), not Next-optimizable hosts */
          <img
            src={avatarImage}
            alt=""
            className="size-10 object-cover"
          />
        ) : (
          getInitials(user?.name)
        )}
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={10} className="outline-none">
          <Menu.Popup className="border-border bg-card max-w-72 min-w-64 rounded-2xl border shadow-lift transition-all duration-150 outline-none data-[ending-style]:translate-y-1 data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0">
            {/* Identity block */}
            <div className="border-border border-b px-4 py-3.5">
              <p className="truncate text-sm font-bold">{user?.name}</p>
              {user?.email && (
                <p className="text-muted-foreground truncate pt-0.5 text-xs">
                  {user.email}
                </p>
              )}
            </div>

            {/* Nav items */}
            <div className="p-1.5">
              <Menu.List>
                {MENU_LINKS.map(({ href, label, icon: Icon }) => (
                  <Menu.LinkItem
                    key={href}
                    href={href}
                    label={label}
                    className={itemClass}
                    render={<Link href={href} />}
                  >
                    <Icon className="text-muted-foreground size-4 shrink-0" />
                    {label}
                  </Menu.LinkItem>
                ))}

                <Menu.Item
                  key="logout"
                  onClick={handleSignOut}
                  className={itemClass}
                >
                  <LogOut className="text-muted-foreground size-4 shrink-0" />
                  Logout
                </Menu.Item>
              </Menu.List>
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export default UserMenu;
