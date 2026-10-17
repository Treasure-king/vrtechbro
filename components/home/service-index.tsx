import Link from "next/link";
import { RevealItem } from "@/components/motion/reveal-item";
import { serviceImage } from "@/lib/images";
import { Spotlight } from "@/components/motion/spotlight";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { iconMap } from "@/lib/icon-map";
import type { ServiceCardProps } from "@/types/service-card";

/**
 * Services as an index of rows rather than a card grid: each row is one link,
 * with the service image revealed on hover for pointer devices.
 */
export function ServiceIndex({ services }: { services: ServiceCardProps[] }) {
  return (
    <ul className="border-border-subtle border-t">
      {services.map((service, i) => {
        const Icon =
          typeof service.icon === "string"
            ? iconMap[service.icon as keyof typeof iconMap]
            : undefined;

        return (
          <RevealItem
            key={service.slug}
            index={i}
            className="border-border-subtle border-b"
          >
            <Link
              href={`/services/${service.slug}`}
              className="group focus-visible:bg-bg-secondary md:hover:bg-bg-secondary/60 block transition-colors outline-none"
            >
              <Spotlight className="relative grid gap-3 py-8 md:grid-cols-12 md:items-center md:gap-8 md:px-4">
                <div className="flex items-center gap-4 md:col-span-5">
                  {Icon && (
                    <Icon
                      className="text-accent-primary h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <h3 className="font-display text-text-primary text-2xl font-semibold tracking-tight md:text-3xl">
                    {service.title}
                  </h3>
                </div>
                <p className="text-text-secondary md:col-span-5">
                  {service.short_description}
                </p>
                <div className="hidden items-center justify-end md:col-span-2 md:flex">
                  {service.image_url && (
                    <div className="border-border-subtle relative mr-4 h-14 w-20 overflow-hidden rounded-md border opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Image
                        src={serviceImage(service.image_url)}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <ArrowUpRight
                    className="text-text-muted group-hover:text-accent-primary h-6 w-6 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
              </Spotlight>
            </Link>
          </RevealItem>
        );
      })}
    </ul>
  );
}
