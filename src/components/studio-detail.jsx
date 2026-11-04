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
import { toast } from "sonner";
import BookingDialog from "@/components/booking-dialog";
import ReviewForm from "@/components/review-form";
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
      className="absolute top-1/2 z-10 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white text-[#16131F] shadow-sm outline-none transition-colors hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-ring/50"
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

function StudioGallery({ studio, view, setView }) {
  const Icon = CATEGORY_ICONS[studio.category] ?? Camera;

  return (
    <>
      <div
        className={cn(
          "bg-[length:180%_180%] relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl",
          studio.gradient
        )}
      >
        {studio.image ? (
          /* eslint-disable-next-line @next/next/no-img-element -- host uploads are arbitrary external URLs, not configured Next image hosts */
          <img
            src={studio.image}
            alt={`${studio.name} gallery view ${view + 1}`}
            className="absolute inset-0 size-full object-cover"
            style={{ objectPosition: VIEW_POSITIONS[view] }}
          />
        ) : (
          <>
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
          </>
        )}

        <GalleryNavButton
          direction="prev"
          onClick={() => setView((current) => (current + 2) % 3)}
        />
        <GalleryNavButton
          direction="next"
          onClick={() => setView((current) => (current + 1) % 3)}
        />
      </div>

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
              studio.gradient,
              view === index ? "ring-2 ring-brand" : "hover:opacity-90"
            )}
          >
            {studio.image ? (
              /* eslint-disable-next-line @next/next/no-img-element -- host uploads are arbitrary external URLs, not configured Next image hosts */
              <img
                src={studio.image}
                alt=""
                className="absolute inset-0 size-full object-cover"
                style={{ objectPosition: position }}
              />
            ) : (
              <Icon
                className="size-6 text-white"
                strokeWidth={2.25}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>
    </>
  );
}

export function StudioDetail({
  studio: initialStudio,
  initialReviews = [],
  initialSummary = null,
}) {
  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user;

  const [studio, setStudio] = useState(initialStudio);
  const [reviews, setReviews] = useState(initialReviews);
  const [summary, setSummary] = useState(initialSummary);
  const [view, setView] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const { slug, name, category, location, price, gradient } = studio;
  const wishlist = useWishlist(user?.id);
  const saved = wishlist.includes(slug);
  const rating = summary?.average ?? studio.rating ?? 0;
  const reviewsCount = studio.reviewsCount ?? summary?.count ?? reviews.length;

  function goToLogin() {
    setNextUrl(`/studios/${slug}`);
    router.push("/login");
  }

  async function handleSave() {
    setWishlistError(null);

    if (!user) {
      goToLogin();
      return;
    }

    setIsTogglingWishlist(true);
    try {
      const wishlisted = await toggleWishlist(studio);

      toast.success(
        wishlisted ? "Saved to wishlist." : "Removed from wishlist."
      );
    } catch (error) {
      setWishlistError(error.message);
      toast.error(error.message);
    } finally {
      setIsTogglingWishlist(false);
    }
  }

  function handleBook() {
    if (!user) {
      goToLogin();
      return;
    }

    setBookingOpen(true);
  }

  function handleReviewSubmitted({ review, studio: updatedStudio }) {
    if (review) {
      setReviews((current) => [review, ...current]);
      setSummary((current) =>
        current
          ? {
              ...current,
              average:
                Math.round(
                  ((current.average * current.count + review.rating) /
                    (current.count + 1)) *
                    10
                ) / 10,
              count: current.count + 1,
            }
          : { average: review.rating, count: 1, distribution: [] }
      );
    }

    if (updatedStudio) {
      setStudio((current) => ({ ...current, ...updatedStudio }));
    } else {
      setStudio((current) => ({
        ...current,
        reviewsCount: (current.reviewsCount ?? 0) + 1,
      }));
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <Breadcrumb name={name} />

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
        {/* Main column */}
        <div className="min-w-0">
          <StudioGallery studio={studio} view={view} setView={setView} />

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
              {Number(rating).toFixed(1)} ({reviewsCount} reviews)
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
            {(studio.amenities ?? []).length ? (
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
            ) : (
              <p className="text-muted-foreground mt-3 text-sm">
                The host has not listed amenities yet.
              </p>
            )}
          </DetailSection>

          <DetailSection title="Hosted by">
            <div className="mt-4 flex items-center gap-3.5">
              <span className="bg-brand grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white">
                {studio.host?.initials ?? "H"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold">
                  {studio.host?.name ?? "StudioSpace host"}
                </p>
                <p className="text-muted-foreground truncate text-sm">
                  {studio.host?.tagline ?? "Responds within 24 hours"}
                </p>
              </div>
            </div>
          </DetailSection>

          <DetailSection title="Reviews">
            {reviews.length ? (
              <ul className="divide-border mt-2 divide-y">
                {reviews.map((review, index) => (
                  <li
                    key={review._id ?? `${review.name}-${index}`}
                    className="py-4 first:pt-4 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[15px] font-bold">{review.name}</p>
                      <ReviewStars rating={Number(review.rating)} />
                    </div>
                    <p className="text-muted-foreground pt-1.5 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground mt-3 text-sm">
                No reviews yet — be the first after your session.
              </p>
            )}

            <ReviewForm
              studioId={studio._id ?? slug}
              user={user}
              onSubmitted={handleReviewSubmitted}
            />
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
              disabled={isTogglingWishlist}
              onClick={handleSave}
              className={cn(
                buttonVariants({ variant: saved ? "default" : "outline" }),
                "mt-2.5 h-11 w-full cursor-pointer justify-center gap-2 rounded-full font-bold outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-70",
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

            {wishlistError && (
              <p className="text-destructive mt-2 text-xs">{wishlistError}</p>
            )}

            <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
              You will not be charged until the host confirms your request.
            </p>
          </div>
        </aside>
      </div>

      <BookingDialog
        studio={studio}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </main>
  );
}

export default StudioDetail;
