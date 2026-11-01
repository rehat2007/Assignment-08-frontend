"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { cn } from "cn";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-10 rounded-full"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* CSS-driven swap avoids hydration mismatch before the theme is resolved */}
      <Moon className="hidden dark:block" />
      <Sun className="block dark:hidden" />
    </Button>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background supports-[backdrop-filter]:bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Center links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-sm py-1 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "bg-brand absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full transition-opacity",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "hidden h-10 rounded-full px-5 sm:inline-flex"
            )}
          >
            Login
          </Link>

          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-10 rounded-full bg-brand px-5 text-white hover:bg-brand/90"
            )}
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
