import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: readonly string[];
  className?: string;
  /** Seconds for one full loop */
  duration?: number;
};

/** Infinite horizontal strip. Pure CSS, pauses on hover, stops for reduced motion. */
export function Marquee({ items, className, duration = 40 }: MarqueeProps) {
  const track = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="marquee-track flex shrink-0 items-center gap-12 pr-12"
      style={{ animationDuration: `${duration}s` }}
    >
      {items.map((item) => (
        <li key={item} className="whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee group flex overflow-hidden", className)}>
      {track(false)}
      {track(true)}
    </div>
  );
}
