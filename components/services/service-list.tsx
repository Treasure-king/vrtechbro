import Link from "next/link";
import { RevealItem } from "@/components/motion/reveal-item";
import { serviceImage } from "@/lib/images";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { iconMap } from "@/lib/icon-map";
import { ServiceArt } from "@/components/services/service-art";
import type { ServiceCardProps } from "@/types/service-card";

type Group = { name: string; services: ServiceCardProps[] };

/** Groups services by their `category` field, keeping first-seen order. */
function groupByCategory(services: ServiceCardProps[]): Group[] {
  const groups = new Map<string, ServiceCardProps[]>();
  for (const s of services) {
    const key = s.category?.trim() || "Services";
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  return [...groups].map(([name, list]) => ({ name, services: list }));
}

function ServiceRow({
  service,
  index,
}: {
  service: ServiceCardProps;
  index: number;
}) {
  const Icon =
    typeof service.icon === "string"
      ? iconMap[service.icon as keyof typeof iconMap]
      : undefined;
  const keywords = (service.keywords ?? []).slice(0, 4);

  return (
    <RevealItem index={index} className="border-border-subtle border-b">
      <Link
        href={`/services/${service.slug}`}
        className="group focus-visible:bg-bg-secondary md:hover:bg-bg-secondary/60 grid gap-5 py-8 transition-colors outline-none sm:grid-cols-[1fr_9rem] sm:items-center md:px-4 lg:grid-cols-[1fr_11rem]"
      >
        <div>
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon
                className="text-accent-primary h-5 w-5 shrink-0"
                aria-hidden="true"
              />
            )}
            <h3 className="font-display text-text-primary text-2xl font-semibold tracking-tight md:text-3xl">
              {service.title}
            </h3>
            <ArrowUpRight
              className="text-text-muted group-hover:text-accent-primary ml-auto h-5 w-5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:hidden"
              aria-hidden="true"
            />
          </div>
          {service.short_description && (
            <p className="text-text-secondary mt-3 max-w-2xl leading-relaxed">
              {service.short_description}
            </p>
          )}
          {keywords.length > 0 && (
            <p className="text-text-muted mt-3 text-sm">
              <span className="sr-only">Covers: </span>
              {keywords.join(", ")}
            </p>
          )}
        </div>

        <div className="border-border-subtle bg-bg-secondary relative hidden aspect-[4/3] overflow-hidden rounded-lg border sm:block">
          {service.image_url ? (
            <Image
              src={serviceImage(service.image_url)}
              alt=""
              fill
              sizes="176px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ServiceArt className="p-3" />
          )}
        </div>
      </Link>
    </RevealItem>
  );
}

/**
 * Full service catalogue. With more than one category, each group gets a
 * sticky label in the left column; with one, the list spans the full width.
 */
export function ServiceList({ services }: { services: ServiceCardProps[] }) {
  const groups = groupByCategory(services);
  const grouped = groups.length > 1;

  return (
    <div className="space-y-16">
      {groups.map((group) => (
        <section
          key={group.name}
          aria-label={grouped ? group.name : undefined}
          className={
            grouped ? "grid gap-6 lg:grid-cols-12 lg:gap-12" : undefined
          }
        >
          {!grouped && <h2 className="sr-only">All services</h2>}
          {grouped && (
            <div className="lg:col-span-3">
              <h2 className="font-display text-text-primary text-lg font-semibold lg:sticky lg:top-28">
                {group.name}
                <span className="text-text-muted ml-2 font-normal">
                  {group.services.length}
                </span>
              </h2>
            </div>
          )}
          <ul
            className={
              grouped
                ? "border-border-subtle border-t lg:col-span-9"
                : "border-border-subtle border-t"
            }
          >
            {group.services.map((service, i) => (
              <ServiceRow key={service.slug} service={service} index={i} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
