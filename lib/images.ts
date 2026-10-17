/**
 * Image paths used across the site. Files live in public/images/:
 *   brand/     logo files
 *   site/      page backgrounds and illustrations
 *   services/  one illustration per service
 *   process/   process step illustrations
 */
export const SITE_IMAGES = {
  heroBg: "/images/site/hero-bg.webp",
  aboutStudio: "/images/site/about-studio.webp",
  ctaBg: "/images/site/cta-bg.webp",
  notFound: "/images/site/not-found.webp",
  blogFallback: "/images/site/blog-fallback.webp",
} as const;

const SERVICE_IMAGES = new Set([
  "artificial-intelligence",
  "automation",
  "cloud",
  "digital-marketing",
  "e-commerce",
  "it-services",
  "mobile-apps",
  "seo",
  "ui-ux-design",
  "website-development",
]);

/**
 * Supabase `services.image_url` rows may still hold the old flat paths
 * (e.g. "/images/seo.png"). Map those to the optimised files in
 * /images/services/. Anything else (new paths, remote URLs) passes through.
 */
export function serviceImage(url: string): string;
export function serviceImage(url?: string | null): string | undefined;
export function serviceImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  const legacy = url.match(/^\/images\/([a-z0-9-]+)\.(png|webp)$/i);
  if (!legacy) return url;
  const name =
    legacy[1].toLowerCase() === "it" ? "it-services" : legacy[1].toLowerCase();
  return SERVICE_IMAGES.has(name) ? `/images/services/${name}.webp` : url;
}
