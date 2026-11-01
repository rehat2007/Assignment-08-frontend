import { CircleUserRound, Headphones, ShieldCheck, Wrench } from "lucide-react";
import { cn } from "cn";

// Palette is fixed to the light card look from the design, independent of theme.
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
      <div className="rounded-3xl bg-[#f4f2f3] px-6 py-12 text-[#17171c] sm:px-10 sm:py-14 lg:px-14">
        <p className="text-xs font-bold tracking-[0.2em] text-[#f0856b] uppercase">
          Host Guarantee &amp; Creator Support
        </p>
        <h2 className="mt-3 max-w-sm text-3xl font-bold tracking-tight sm:text-4xl">
          Book with less worry on both sides
        </h2>

        <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, description }) => (
            <li key={title}>
              <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
              <h3 className="mt-5 font-bold tracking-tight">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#57565c]">
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
