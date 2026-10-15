import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { iconMap } from '@/lib/helper'
import { ServiceArt } from '@/components/services/service-art'
import type { ServiceCardProps } from '@/types/service-card'

type Group = { name: string; services: ServiceCardProps[] }

/** Groups services by their `category` field, keeping first-seen order. */
function groupByCategory(services: ServiceCardProps[]): Group[] {
  const groups = new Map<string, ServiceCardProps[]>()
  for (const s of services) {
    const key = s.category?.trim() || 'Services'
    groups.set(key, [...(groups.get(key) ?? []), s])
  }
  return [...groups].map(([name, list]) => ({ name, services: list }))
}

function ServiceRow({ service }: { service: ServiceCardProps }) {
  const Icon = typeof service.icon === 'string' ? iconMap[service.icon as keyof typeof iconMap] : undefined
  const keywords = (service.keywords ?? []).slice(0, 4)

  return (
    <li className="border-b border-border-subtle">
      <Link
        href={`/services/${service.slug}`}
        className="group grid gap-5 py-8 outline-none transition-colors focus-visible:bg-bg-secondary sm:grid-cols-[1fr_9rem] sm:items-center md:px-4 md:hover:bg-bg-secondary/60 lg:grid-cols-[1fr_11rem]"
      >
        <div>
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5 shrink-0 text-accent-primary" aria-hidden="true" />}
            <h3 className="font-display text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
              {service.title}
            </h3>
            <ArrowUpRight
              className="ml-auto h-5 w-5 shrink-0 text-text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-primary sm:hidden"
              aria-hidden="true"
            />
          </div>
          {service.short_description && (
            <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">{service.short_description}</p>
          )}
          {keywords.length > 0 && (
            <p className="mt-3 text-sm text-text-muted">
              <span className="sr-only">Covers: </span>
              {keywords.join(', ')}
            </p>
          )}
        </div>

        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-lg border border-border-subtle bg-bg-secondary sm:block">
          {service.image_url ? (
            <Image
              src={service.image_url}
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
    </li>
  )
}

/**
 * Full service catalogue. With more than one category, each group gets a
 * sticky label in the left column; with one, the list spans the full width.
 */
export function ServiceList({ services }: { services: ServiceCardProps[] }) {
  const groups = groupByCategory(services)
  const grouped = groups.length > 1

  return (
    <div className="space-y-16">
      {groups.map((group) => (
        <section
          key={group.name}
          aria-label={grouped ? group.name : undefined}
          className={grouped ? 'grid gap-6 lg:grid-cols-12 lg:gap-12' : undefined}
        >
          {!grouped && <h2 className="sr-only">All services</h2>}
          {grouped && (
            <div className="lg:col-span-3">
              <h2 className="font-display text-lg font-semibold text-text-primary lg:sticky lg:top-28">
                {group.name}
                <span className="ml-2 font-normal text-text-muted">{group.services.length}</span>
              </h2>
            </div>
          )}
          <ul className={grouped ? 'border-t border-border-subtle lg:col-span-9' : 'border-t border-border-subtle'}>
            {group.services.map((service) => (
              <ServiceRow key={service.slug} service={service} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
