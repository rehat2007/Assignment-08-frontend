"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu } from "@base-ui/react/menu";
import {
  LayoutDashboard,
  List,
  LogOut,
  Plus,
  Ticket,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { inputClass, labelClass } from "@/components/auth/shared";
import { apiFetch } from "@/lib/api";
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
  const { refetch } = authClient.useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [image, setImage] = useState(user?.image ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const avatarImage = getAvatarImage(user?.image);

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("You've been logged out.");
    router.push("/");
  }

  function openProfile() {
    setName(user?.name ?? "");
    setImage(user?.image ?? "");
    setProfileError(null);
    setProfileOpen(true);
  }

  async function handleProfileSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setProfileError(null);

    try {
      await apiFetch("/users/me", {
        method: "PATCH",
        body: {
          name: name.trim(),
          image: image.trim() || null,
        },
      });

      await refetch();
      toast.success("Profile updated.");
      setProfileOpen(false);
    } catch (requestError) {
      setProfileError(requestError.message);
      toast.error(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
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
                    key="profile"
                    onClick={openProfile}
                    className={itemClass}
                  >
                    <User className="text-muted-foreground size-4 shrink-0" />
                    Edit profile
                  </Menu.Item>

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

      <Dialog.Root open={profileOpen} onOpenChange={setProfileOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="bg-black/60 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Popup className="border-border bg-card fixed top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <form onSubmit={handleProfileSave}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Dialog.Title className="text-xl font-bold tracking-tight">
                    Edit profile
                  </Dialog.Title>
                  <Dialog.Description className="text-muted-foreground mt-1.5 text-sm">
                    Update the name and avatar shown across StudioSpace.
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="Close profile dialog"
                  className="text-muted-foreground hover:bg-accent/50 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <X className="size-4" aria-hidden="true" />
                </Dialog.Close>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="profile-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="profile-image" className={labelClass}>
                    Avatar URL
                  </label>
                  <input
                    id="profile-image"
                    type="url"
                    placeholder="https://i.ibb.co/your-photo.jpg"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    className={inputClass}
                  />
                  <p className="text-muted-foreground pt-2 text-xs">
                    Leave blank to fall back to your initials. Upload a photo
                    from the host listing form first if you need a URL.
                  </p>
                </div>

                {profileError && (
                  <p
                    role="alert"
                    className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2.5 text-sm"
                  >
                    {profileError}
                  </p>
                )}

                <div className="flex justify-end gap-2.5 pt-1">
                  <Dialog.Close
                    className={cn(
                      "border-border flex h-10 cursor-pointer items-center rounded-full border px-5 text-sm font-bold outline-none transition-colors hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50",
                      isSaving && "pointer-events-none opacity-50"
                    )}
                  >
                    Cancel
                  </Dialog.Close>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-brand flex h-10 cursor-pointer items-center rounded-full px-5 text-sm font-bold text-white outline-none transition-colors hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSaving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export default UserMenu;
