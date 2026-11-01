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
    href: "/studios?category=workshops",
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
              className="group flex h-full flex-col gap-3 rounded-xl bg-card p-6 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 hover:bg-accent/50"
            >
              <span className="bg-brand/15 text-brand grid size-10 shrink-0 place-items-center rounded-lg transition-colors group-hover:bg-brand/25">
                <Icon className="size-5" />
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
