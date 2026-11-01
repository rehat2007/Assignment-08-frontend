import HostCta from "@/components/host-cta";
const VALUES = [
  {
    title: "Fair hourly pricing",
    description:
      "Hosts set their own rates. We show the deposit and total before you book.",
  },
  {
    title: "Verified hosts",
    description:
      "Every host confirms identity and equipment safety before their first listing goes live.",
  },
  {
    title: "Built for makers",
    description:
      "Filters, calendars and invoices designed around how shoots and sessions actually run.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Intro */}
        <p className="text-brand-strong text-xs font-bold tracking-[0.2em] uppercase">
          About Us
        </p>
        <h1 className="mt-2 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
          Creative space should not be a luxury
        </h1>
        <p className="text-muted-foreground mt-4 max-w-lg leading-relaxed">
          StudioSpace connects creators who need a room with the people who
          have one. We started with a single cyc wall in Dhaka and now list
          photo studios, sound stages, podcast lounges, music suites and
          workshops across Bangladesh.
        </p>

        {/* Values */}
        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {VALUES.map(({ title, description }) => (
            <li
              key={title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="font-bold tracking-tight">{title}</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <HostCta
        title="Ready to make something?"
        ctaLabel="Explore Studios"
        ctaHref="/studios"
      />
    </main>
  );
}
