'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ServiceCardProps } from '@/types/service-card'
import { iconMap } from '@/lib/helper'
import { ArrowRight } from 'lucide-react'

const tagColors = [
  'bg-accent-primary/10 text-accent-primary',
  'bg-success/10 text-success',
  'bg-accent-secondary/10 text-accent-secondary',
  'bg-warning/10 text-warning',
  'bg-[oklch(0.70_0.15_200)]/10 text-[oklch(0.70_0.15_200)]',
  'bg-error/10 text-error',
]

export function ServiceCard({
  title,
  short_description,
  icon,
  image_url,
  slug,
  keywords = [],
  delay = 0,
}: ServiceCardProps) {
  const Icon = typeof icon === 'string' ? iconMap[icon as keyof typeof iconMap] : icon
  const serviceUrl = slug ? `/services/${slug}` : undefined
  const shouldReduceMotion = useReducedMotion()

  const card = (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : delay }}
      className="group flex flex-col justify-between h-full bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-xl hover:shadow-accent-primary/5"
      itemScope
      itemType="https://schema.org/Service"
    >
       {image_url ? (
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={image_url}
            alt={title || 'Service Image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="relative w-full h-20 flex items-center justify-center mt-4">
          {Icon && (
            <div className="p-3 rounded-xl bg-accent-primary/10 border border-accent-primary/20">
              <Icon className="text-accent-primary h-10 w-10" />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 w-full p-6 justify-between gap-4 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <h3 itemProp="name" className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors duration-200">
            {title}
          </h3>

          <p
            itemProp="description"
            className="text-sm text-text-secondary leading-relaxed line-clamp-3"
          >
            {short_description}
          </p>
        </div>

        {keywords.length > 0 && (
          <div className="w-full flex flex-wrap gap-2" aria-label="Service keywords">
            {keywords.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className={cn(
                  'px-2.5 py-1 text-xs rounded-full font-medium',
                  tagColors[i % tagColors.length]
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {serviceUrl && (
          <div className="mt-2">
            <span className="text-sm text-accent-primary font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
              Learn more
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        )}
      </div>
    </motion.article>
  )

  return serviceUrl ? (
    <Link
      href={serviceUrl}
      passHref
      aria-label={`Read more about ${title} service`}
      className="h-full block"
    >
      {card}
    </Link>
  ) : (
    card
  )
}
