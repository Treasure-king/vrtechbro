import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The site logo. Swap the file in lib/brand.ts to change it everywhere. */
export function Logo({
  size = 56,
  priority,
  className,
}: {
  size?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={BRAND.logo.src}
      alt={BRAND.logo.alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      priority={priority}
      className={cn("h-auto", className)}
    />
  );
}
