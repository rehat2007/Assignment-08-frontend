import { Camera, Film, Mic, Music, Palette } from "lucide-react";
import { cn } from "cn";

const CATEGORY_ICONS = {
  photo: Camera,
  film: Film,
  podcast: Mic,
  music: Music,
  workshop: Palette,
};

/**
 * The studio "photo": the gradient art + category glyph used everywhere a
 * small studio image is shown (cards, booking rows, listing rows). Blobs are
 * percentage-sized so the art scales with any container.
 */
export function StudioArt({ studio, className, iconClassName }) {
  const Icon = CATEGORY_ICONS[studio.category] ?? Camera;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        studio.gradient,
        className
      )}
    >
      <span className="absolute -top-[45%] -right-[35%] size-[110%] rounded-full bg-white/15" />
      <span className="absolute -bottom-[30%] -left-[25%] size-[80%] rounded-full bg-white/10" />
      <Icon
        className={cn("relative size-7 text-white", iconClassName)}
        strokeWidth={2.25}
      />
    </div>
  );
}

export default StudioArt;
