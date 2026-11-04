"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Camera, ChevronLeft, ChevronRight, Film, Mic } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

// Local studio photography from Unsplash (free to use under the Unsplash License).
const SLIDES = [
  {
    eyebrow: "Photo studios",
    title: "Find the room your shoot needs.",
    description:
      "Cyc walls, strobes and seamless paper, booked by the hour from verified hosts.",
    image: "/images/hero-photo.jpg",
    icon: Camera,
  },
  {
    eyebrow: "Film stages",
    title: "Rent a sound stage, not a warehouse.",
    description:
      "Lighting grids, power and green rooms ready before your crew arrives.",
    image: "/images/hero-film.jpg",
    icon: Film,
  },
  {
    eyebrow: "Podcast lounges",
    title: "Record where it already sounds good.",
    description:
      "Treated rooms with broadcast microphones. Walk in, plug in, publish.",
    image: "/images/hero-podcast.jpg",
    icon: Mic,
  },
];

const STATS = [
  { value: "1,200+", label: "verified studios" },
  { value: "$35", label: "average starting hourly rate" },
  { value: "4.8 / 5", label: "average host rating" },
];

function useSelectedSnap() {
  const { api } = useCarousel();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  return { selected, scrollTo: (index) => api?.scrollTo(index) };
}

function HeroAutoplay() {
  const { api } = useCarousel();

  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => api.scrollNext(), 6000);
    return () => clearInterval(id);
  }, [api]);

  return null;
}

function HeroIndicators() {
  const { selected, scrollTo } = useSelectedSnap();

  return (
    <div className="flex items-center gap-1.5">
      {SLIDES.map((slide, index) => (
        <button
          key={slide.eyebrow}
          type="button"
          aria-label={`Go to slide ${index + 1}: ${slide.eyebrow}`}
          onClick={() => scrollTo(index)}
          className={cn(
            "h-2.5 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            selected === index
              ? "bg-brand w-8"
              : "w-2.5 bg-white/45 hover:bg-white/70"
          )}
        />
      ))}
    </div>
  );
}

function HeroControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Previous slide"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Next slide"
        disabled={!canScrollNext}
        onClick={scrollNext}
        className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

function HeroSlide({ eyebrow, title, description, image, icon: Icon }) {
  return (
    <div
      className="relative flex min-h-[420px] items-end overflow-hidden bg-neutral-950 bg-cover bg-center px-6 pb-20 pt-16 sm:min-h-[540px] sm:px-10 md:px-14"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Watermark icon */}
      <Icon
        aria-hidden="true"
        className="absolute top-1/2 right-[10%] hidden size-40 -translate-y-1/2 text-white/30 lg:block"
        strokeWidth={1.75}
      />

      {/* Cinematic overlay, like the reference */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,9,22,0.86)_8%,rgba(12,9,22,0.45)_55%,rgba(12,9,22,0.1))]"
      />

      <div className="relative z-10 max-w-[620px]">
        <p className="text-[#FFB199] text-xs font-bold tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-3.5 text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-lg text-lg text-[#E8E4F0]">{description}</p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/studios"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-brand h-10 rounded-full px-5 text-white hover:bg-brand/90"
            )}
          >
            Explore Studios
            <ArrowRight data-icon="inline-end" />
          </Link>
          <Link
            href="/register-host"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              /* Stays flat — no lift/glow on the Host CTA. */
              "h-10 rounded-full border-white bg-transparent px-5 font-bold text-white hover:bg-white/10 hover:translate-y-0! hover:shadow-none!"
            )}
          >
            Host Your Space
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="sr-only">
        StudioSpace — book photo, podcast and creator studios by the hour
      </h1>

      {/* The root clips everything to the rounded frame; the embla gutters
          (-ml-4/pl-4) are neutralized so the slide fills it exactly, with no
          gradient spilling out of the box. */}
      <Carousel
        opts={{ loop: true }}
        className="border-border overflow-hidden rounded-2xl border"
      >
        <CarouselContent className="-ml-0">
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.eyebrow} className="pl-0">
              <HeroSlide {...slide} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <HeroAutoplay />

        {/* Bottom-right controls: indicators + prev/next, like the reference */}
        <div className="absolute right-4 bottom-4 flex items-center gap-3 sm:right-6 sm:bottom-5">
          <HeroIndicators />
          <HeroControls />
        </div>
      </Carousel>

      <dl className="mt-7 flex flex-wrap gap-x-16 gap-y-4">
        {STATS.map(({ value, label }) => (
          <div key={label} className="flex flex-col gap-1">
            <dd className="text-2xl font-bold tracking-tight">{value}</dd>
            <dt className="text-sm text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
