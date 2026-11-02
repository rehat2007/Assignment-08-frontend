import Link from "next/link";
import Logo from "@/components/logo";
import NewsletterForm from "@/components/newsletter-form";
import { cn } from "cn";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/register-host", label: "Host Your Space" },
];

const POPULAR_CATEGORIES = [
  { href: "/studios?category=photo", label: "Photo Studios" },
  { href: "/studios?category=film", label: "Film Stages" },
  { href: "/studios?category=podcast", label: "Podcast Lounges" },
  { href: "/studios?category=music", label: "Music Suites" },
  { href: "/studios?category=workshop", label: "Workshops" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of use" },
  { href: "/privacy", label: "Privacy" },
  { href: "/host-guarantee", label: "Host guarantee terms" },
];

// Brand glyphs aren't shipped by this lucide build, so they are hand-drawn here.
function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.826l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.92 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const SOCIALS = [
  { href: "https://x.com", label: "StudioSpace on X", Icon: XIcon },
  {
    href: "https://instagram.com",
    label: "StudioSpace on Instagram",
    Icon: InstagramIcon,
  },
  {
    href: "https://youtube.com",
    label: "StudioSpace on YouTube",
    Icon: YoutubeIcon,
  },
  {
    href: "https://linkedin.com",
    label: "StudioSpace on LinkedIn",
    Icon: LinkedinIcon,
  },
];

function FooterColumn({ title, children, className, ...props }) {
  return (
    <nav
      aria-label={title}
      className={cn("flex flex-col gap-5", className)}
      {...props}
    >
      <h3 className="text-footer-muted text-xs font-bold tracking-[0.15em] uppercase">
        {title}
      </h3>
      {children}
    </nav>
  );
}

export function SiteFooter({ className, ...props }) {
  return (
    <footer
      className={cn("bg-footer text-footer-foreground w-full", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1.2fr_1.5fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <Logo />
            <p className="text-footer-muted mt-5 text-sm leading-relaxed">
              Book creative spaces from the people who run them. Photo studios,
              sound stages, podcast rooms and music suites, priced by the hour.
            </p>
            <ul className="mt-6 flex gap-2.5">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    aria-label={label}
                    className="hover:border-brand hover:text-brand grid size-10 place-items-center rounded-full border border-white/20 bg-transparent outline-none transition-colors focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/50"
                  >
                    <Icon className="size-4.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <FooterColumn title="Quick links">
            <ul className="flex flex-col gap-3.5">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 hover:text-brand"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Popular categories */}
          <FooterColumn title="Popular categories">
            <ul className="flex flex-col gap-3.5">
              {POPULAR_CATEGORIES.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 hover:text-brand"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Newsletter */}
          <FooterColumn title="Newsletter">
            <p className="text-footer-muted text-sm">
              New studios and booking tips, once a month.
            </p>
            <NewsletterForm />
          </FooterColumn>
        </div>

        {/* Bottom bar */}
        <div className="border-footer-border text-footer-muted mt-12 flex flex-col justify-between gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center">
          <p>© 2026 StudioSpace. All rights reserved.</p>
          <ul className="flex items-center gap-2">
            {LEGAL_LINKS.map(({ href, label }, index) => (
              <li key={label} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">·</span>}
                <Link
                  href={href}
                  className="outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 hover:text-brand"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
