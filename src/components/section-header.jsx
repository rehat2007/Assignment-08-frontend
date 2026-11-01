import { cn } from "cn";

/**
 * Shared section header: uppercase orange eyebrow + bold title,
 * as seen across the landing page sections.
 *
 * `as` controls the heading tag rendered ("h1" gets the larger page-title size).
 */
export function SectionHeader({
  eyebrow,
  title,
  as = "h2",
  className,
  ...props
}) {
  const Heading = as;

  return (
    <div className={cn("max-w-2xl", className)} {...props}>
      <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase">
        {eyebrow}
      </p>
      <Heading
        className={cn(
          "mt-2 font-bold tracking-tight",
          as === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
        )}
      >
        {title}
      </Heading>
    </div>
  );
}

export default SectionHeader;
