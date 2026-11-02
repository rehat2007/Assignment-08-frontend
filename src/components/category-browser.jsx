import Link from "next/link";
import { Camera, Film, Mic, Music, Palette } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { cn } from "cn";

const CATEGORIES = [
  {
    href: "/studios?category=photo",
    icon: Camera,
    title: "Photo Studios",
    description: "Cyc walls, strobes and backdrops",
  },
  {
    href: "/studios?category=film",
    icon: Film,
    title: "Film Stages",
    description: "Sound stages and cinema sets",
  },
  {
    href: "/studios?category=podcast",
    icon: Mic,
    title: "Podcast Lounges",
    description: "Treated rooms, mics and sofas",
  },
  {
    href: "/studios?category=music",
    icon: Music,
    title: "Music Suites",
    description: "Recording booths and control rooms",
  },
  {
    href: "/studios?category=workshop",
    icon: Palette,
    title: "Workshops",
    description: "Art, ceramics and maker space",
  },
];

export function CategoryBrowser() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Browse by Category"
        title="What are you making?"
      />

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map(({ href, icon: Icon, title, description }) => (
          <li key={title}>
            <Link
              href={href}
              className="group border-border hover:border-brand flex h-full flex-col gap-3 rounded-xl border bg-card p-6 outline-none transition-[transform,border-color,box-shadow] duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="bg-soft text-soft-foreground group-hover:bg-brand/25 grid size-13 shrink-0 place-items-center rounded-2xl transition-colors">
                <Icon className="size-6" />
              </span>
              <h3 className="font-bold tracking-tight">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CategoryBrowser;
