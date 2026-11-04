import { SectionHeader } from "@/components/section-header";
import { cn } from "cn";

const STEPS = [
  {
    title: "Discover Spaces",
    description:
      "Filter by category, location and hourly rate to see rooms that fit.",
  },
  {
    title: "Select Shoot Hours",
    description:
      "Pick a date and your start and end time. Taken slots are blocked.",
  },
  {
    title: "Book Instantly",
    description: "See the total with deposit up front and send the request.",
  },
  {
    title: "Create & Produce",
    description:
      "Arrive, set up and shoot. Your host is a message away.",
  },
];

export function HowItWorks({
  eyebrow = "How Booking Works",
  title = "From search to shoot in four steps",
  description,
  steps = STEPS,
  headingLevel = "h2",
  className,
  ...props
}) {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8", className)}
      {...props}
    >
      <SectionHeader eyebrow={eyebrow} title={title} as={headingLevel} />
      {description && (
        <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
          {description}
        </p>
      )}

      <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ title, description }, index) => (
          <li
            key={title}
            className="flex h-full flex-col rounded-xl bg-card p-7"
          >
            <span className="bg-foreground text-background grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold">
              {index + 1}
            </span>
            <h3 className="mt-5 font-bold tracking-tight">{title}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default HowItWorks;

