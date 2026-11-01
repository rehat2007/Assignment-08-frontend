import { CircleUserRound, Headphones, ShieldCheck, Wrench } from "lucide-react";
import { cn } from "cn";

/* The card uses inverted tokens (bg-foreground / text-background), so it is a
   dark panel on the light theme and a light panel on the dark theme — the same
   contrast inversion the StudioSpace reference applies to its "ink" cards. */
const PERKS = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    description:
      "Every booking is covered for accidental damage up to $10,000.",
  },
  {
    icon: CircleUserRound,
    title: "Verified profiles",
    description: "Hosts and creators confirm their identity before the first booking.",
  },
  {
    icon: Wrench,
    title: "Equipment safety",
    description: "Hosts certify lighting, rigging and electrical gear on a yearly checklist.",
  },
  {
    icon: Headphones,
    title: "24/7 host support",
    description: "A real person answers by chat any hour of the day.",
  },
];

export function GuaranteeSection({ className, ...props }) {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8", className)}
      {...props}
    >
      <div className="bg-foreground text-background rounded-3xl px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
        <p className="text-[#FFB199] text-xs font-bold tracking-[0.2em] uppercase">
          Host Guarantee &amp; Creator Support
        </p>
        <h2 className="mt-3 max-w-sm text-3xl font-extrabold tracking-tight sm:text-4xl">
          Book with less worry on both sides
        </h2>

        <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, description }) => (
            <li key={title}>
              <span className="bg-background/20 grid size-12 place-items-center rounded-xl">
                <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-bold tracking-tight">{title}</h3>
              <p className="text-background/75 mt-1.5 text-sm leading-relaxed">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default GuaranteeSection;
