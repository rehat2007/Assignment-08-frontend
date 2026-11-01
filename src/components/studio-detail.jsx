"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Film,
  Heart,
  MapPin,
  Mic,
  Music,
  Palette,
  Star,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { setNextUrl } from "@/lib/session-redirect";
import { toggleWishlist, useWishlist } from "@/lib/wishlist";
import { categoryLabel } from "@/lib/studios";
import { cn } from "cn";

const CATEGORY_ICONS = {
  photo: Camera,
  film: Film,
  podcast: Mic,
  music: Music,
  workshop: Palette,
};

// Gallery views: same studio art re-framed (bg size/position) like the
// reference, plus a camera glyph standing in for photography.
const VIEW_POSITIONS = ["left top", "center center", "right bottom"];
const THUMB_POSITIONS = ["left top", "right top", "center"];

function GalleryNavButton({ direction, onClick }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous photo" : "Next photo"}
      onClick={onClick}
      className="absolute top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white text-[#16131F] shadow-sm outline-none transition-colors hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-ring/50"
      style={{ [direction === "prev" ? "left" : "right"]: "0.75rem" }}
    >
      <Icon className="size-4" />
    </button>
  );
}

function Breadcrumb({ name }) {
  const linkClass =
    "rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm"
    >
      <Link href="/" className={linkClass}>
        Home
      </Link>
      <ChevronRight
        className="text-muted-foreground size-3.5"
        aria-hidden="true"
      />
      <Link href="/studios" className={linkClass}>
        Explore Studios
      </Link>
      <ChevronRight
        className="text-muted-foreground size-3.5"
        aria-hidden="true"
      />
      <span aria-current="page" className="text-foreground font-semibold">
        {name}
      </span>
    </nav>
  );
}

function SpecificationRow({ label, value }) {
  return (
    <p className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </p>
  );
}

function ReviewStars({ rating }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={cn(
            "size-4",
            star <= rating ? "fill-star text-star" : "text-muted-foreground/40"
          )}
        />
      ))}
    </span>
  );
}

function DetailSection({ title, children }) {
  return (
    <section className="border-border bg-card mt-6 rounded-2xl border p-6">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function StudioDetail({ studio }) {
  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user;

  const { slug, name, category, location, rating, price, gradient } = studio;
  const Icon = CATEGORY_ICONS[category] ?? Camera;
  const [view, setView] = useState(0);
  const wishlist = useWishlist();
  const saved = wishlist.includes(slug);

  function goToLogin() {
    setNextUrl(`/studios/${slug}`);
    router.push("/login");
  }

  function handleSave() {
    if (!user) {
      goToLogin();
      return;
    }
    toggleWishlist(slug);
  }

  function handleBook() {
    if (!user) {
      goToLogin();
      return;
    }
    // TODO: open the booking modal (date/time + conflict checks) like the
    // reference prototype.
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <Breadcrumb name={name} />

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
        {/* Main column */}
        <div className="min-w-0">
          {/* Gallery */}
          <div
            className={cn(
              "bg-[length:180%_180%] relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl",
              gradient
            )}
            style={{ backgroundPosition: VIEW_POSITIONS[view] }}
          >
            <span
              aria-hidden="true"
              className="absolute -top-24 -right-16 size-80 rounded-full bg-white/15"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-16 -left-12 size-52 rounded-full bg-white/10"
            />

            <Icon
              className="relative size-20 text-white"
              strokeWidth={2.25}
              aria-hidden="true"
            />

            <GalleryNavButton
              direction="prev"
              onClick={() => setView((current) => (current + 2) % 3)}
            />
            <GalleryNavButton
              direction="next"
              onClick={() => setView((current) => (current + 1) % 3)}
            />
          </div>

          {/* Thumbnails */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            {THUMB_POSITIONS.map((position, index) => (
              <button
                key={position}
                type="button"
                aria-label={`Show photo ${index + 1}`}
                aria-current={view === index || undefined}
                onClick={() => setView(index)}
                className={cn(
                  "bg-[length:200%_200%] relative flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-xl outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-ring/50",
                  gradient,
                  view === index ? "ring-2 ring-brand" : "hover:opacity-90"
                )}
                style={{ backgroundPosition: position }}
              >
                <Icon
                  className="size-6 text-white"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          {/* Title block */}
          <p className="text-brand pt-7 text-xs font-bold tracking-[0.2em] uppercase">
            {categoryLabel(category)}
          </p>
          <h1 className="mt-1.5 text-4xl font-extrabold tracking-tight sm:text-[2.75rem]">
            {name}
          </h1>
          <p className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {location}
            </span>
            <span className="flex items-center gap-1.5">
              <Star
                className="fill-star text-star size-4"
                aria-hidden="true"
              />
              {rating.toFixed(1)} ({studio.reviewsCount} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4 shrink-0" aria-hidden="true" />
              Up to {studio.capacity} people
            </span>
          </p>

          <DetailSection title="About this space">
            <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">
              {studio.description}
            </p>
          </DetailSection>

          <DetailSection title="Amenities">
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {studio.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="bg-secondary flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold"
                >
                  <Check
                    className="text-muted-foreground size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  {amenity}
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Hosted by">
            <div className="mt-4 flex items-center gap-3.5">
              <span className="bg-brand grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white">
                {studio.host.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold">
                  {studio.host.name}
                </p>
                <p className="text-muted-foreground truncate text-sm">
                  {studio.host.tagline}
                </p>
              </div>
            </div>
          </DetailSection>

          <DetailSection title="Reviews">
            <ul className="divide-border mt-2 divide-y">
              {studio.reviews.map((review) => (
                <li key={review.name} className="py-4 first:pt-4 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[15px] font-bold">{review.name}</p>
                    <ReviewStars rating={review.rating} />
                  </div>
                  <p className="text-muted-foreground pt-1.5 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          </DetailSection>
        </div>

        {/* Booking sidebar */}
        <aside className="self-start lg:sticky lg:top-[88px]">
          <div className="border-border bg-card rounded-2xl border p-6">
            <p className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight">
                ${price}
              </span>
              <span className="text-muted-foreground text-sm">/ hour</span>
            </p>

            <div className="mt-4 space-y-2.5">
              <SpecificationRow
                label="Security deposit"
                value={`$${studio.deposit}`}
              />
              <SpecificationRow
                label="Max capacity"
                value={`${studio.capacity} people`}
              />
              <SpecificationRow
                label="Minimum booking"
                value={`${studio.minHours} hours`}
              />
            </div>

            <button
              type="button"
              onClick={handleBook}
              className={cn(
                buttonVariants(),
                "bg-brand mt-5 h-11 w-full cursor-pointer rounded-full font-bold text-white hover:bg-brand/90"
              )}
            >
              Book now
            </button>

            <button
              type="button"
              aria-pressed={saved}
              onClick={handleSave}
              className={cn(
                buttonVariants({ variant: saved ? "default" : "outline" }),
                "mt-2.5 h-11 w-full cursor-pointer justify-center gap-2 rounded-full font-bold outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                saved
                  ? "bg-soft text-soft-foreground hover:bg-brand/25"
                  : "hover:bg-accent/50"
              )}
            >
              <Heart
                className={cn("size-4", saved && "fill-brand text-brand")}
                aria-hidden="true"
              />
              {saved ? "Saved to wishlist" : "Save to wishlist"}
            </button>

            <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
              You will not be charged until the host confirms your request.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default StudioDetail;
