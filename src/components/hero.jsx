"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const SLIDES = [
  {
    eyebrow: "Photo Studios",
    titleLines: ["Find the room", "your shoot needs."],
    description:
      "Cyc walls, strobes and seamless paper, booked by the hour from verified hosts.",
    gradient: "bg-linear-to-br from-[#572f40] via-[#83575a] to-[#c08b72]",
    icon: Camera,
  },
  {
    eyebrow: "Podcast & Film",
    titleLines: ["Lights, camera,", "quiet on set."],
    description:
      "Ac treated rooms with cinema lighting, grip gear and green rooms ready to book.",
    gradient: "bg-linear-to-br from-[#2b3546] via-[#3f4c5e] to-[#7f8ea0]",
    icon: Camera,
  },
  {
    eyebrow: "Creator Spaces",
    titleLines: ["Content-ready", "daylight studios."],
    description:
      "Bounce walls, product tables and plaza light for creators shooting all day.",
    gradient: "bg-linear-to-br from-[#1f3a4a] via-[#27465a] to-[#6aa08e]",
    icon: Camera,
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
            "h-1.5 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            selected === index ? "bg-brand w-5" : "w-1.5 bg-white/40 hover:bg-white/60"
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

function HeroSlide({ eyebrow, titleLines, description, gradient, icon: Icon }) {
  return (
    <div
      className={cn(
        "relative flex min-h-[380px] items-center overflow-hidden px-6 py-12 sm:px-10 md:px-12 md:py-16",
        gradient
      )}
    >
      {/* Decorative blob on the right, like the reference */}
      <div
        aria-hidden="true"
        className="from-white/25 absolute -top-40 right-[8%] size-[26rem] rounded-full bg-linear-to-b to-transparent"
      />

      {/* Watermark icon */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-[8%] hidden -translate-y-1/2 md:block"
      >
        <Icon className="size-56 text-white/25 lg:size-72" strokeWidth={1.25} />
      </div>

      <div className="relative max-w-xl">
        <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-4 max-w-md text-base text-white/75">{description}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/studios"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-10 rounded-full bg-brand px-5 text-white hover:bg-brand/90"
            )}
          >
            Explore Studios
            <ArrowRight data-icon="inline-end" />
          </Link>
          <Link
            href="/register-host"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-10 rounded-full border-white/30 bg-transparent px-5 text-white hover:bg-white/10"
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

      <Carousel opts={{ loop: true }} className="rounded-2xl border border-border">
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.eyebrow}>
              <HeroSlide {...slide} />
            </CarouselItem>
          ))}
        </CarouselContent>

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
