import Image from "next/image";
import Link from "next/link";
import { SITE_IMAGES } from "@/lib/images";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SiteChrome } from "@/components/layout/site-chrome";

export const metadata: Metadata = {
  title: "Page Not Found | VRTechBro",
  description:
    "Sorry, the page you are looking for does not exist on VRTechBro.",
  robots: {
    index: false,
    follow: true,
  },
};

const DESTINATIONS = [
  { href: "/services", label: "Services", note: "What we build and how" },
  { href: "/blog", label: "Blog", note: "Articles from the studio" },
  { href: "/contact", label: "Contact", note: "Ask us directly" },
];

export default function NotFound() {
  return (
    <SiteChrome>
      <section
        aria-labelledby="not-found-title"
        className="relative overflow-hidden"
      >
        {/* The lost astronaut drifts on the right; faded on the left to keep the text readable */}
        <Image
          src={SITE_IMAGES.notFound}
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none [mask-image:linear-gradient(90deg,transparent_20%,black_70%)] object-cover object-right opacity-50 lg:opacity-70"
        />
        <div
          className="bg-grid pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div className="container-page relative grid gap-12 py-24 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-accent-primary font-mono text-sm">Error 404</p>
            <h1
              id="not-found-title"
              className="type-display text-text-primary mt-4"
            >
              This page doesn&apos;t exist
            </h1>
            <p className="text-text-secondary mt-6 max-w-xl text-lg leading-relaxed">
              The link may be out of date, or the address may have a typo. Check
              the URL, or head to one of the pages below.
            </p>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link href="/">Go to the home page</Link>
              </Button>
            </div>
          </div>

          <nav
            aria-label="Popular pages"
            className="border-border-subtle bg-bg-primary/75 self-end rounded-2xl border px-5 py-2 backdrop-blur-md lg:col-span-4 lg:col-start-9"
          >
            <ul className="divide-border-subtle divide-y">
              {DESTINATIONS.map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="group focus-visible:bg-bg-secondary flex items-baseline justify-between gap-4 py-4 outline-none"
                  >
                    <span className="font-display text-text-primary group-hover:text-accent-hover text-lg font-medium">
                      {d.label}
                    </span>
                    <span className="text-text-muted text-sm">{d.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </SiteChrome>
  );
}
