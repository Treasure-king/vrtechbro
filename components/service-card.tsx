'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ServiceCardProps } from '@/types/service-card'

const tagColors = [
  'bg-blue-500/10 text-blue-400',
  'bg-green-500/10 text-green-400',
  'bg-purple-500/10 text-purple-400',
  'bg-pink-500/10 text-pink-400',
  'bg-yellow-500/10 text-yellow-400',
  'bg-red-500/10 text-red-400',
]

export function ServiceCard({
  title,
  short_description,
  icon: Icon,
  image_url,
  slug,
  keywords = [],
  delay
}: ServiceCardProps) {
  const serviceUrl = slug ? `/services/${slug}` : undefined

  const card = (
    <motion.article
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025 }}
      transition={{ duration: 0.25, delay }}
      className="flex flex-col justify-between h-full hover:bg-darkclip rounded-2xl overflow-hidden shadow-xl/30 hover:shadow-white transition-all duration-100 p-4 border-[1px] border-white"
      itemScope
      itemType="https://schema.org/Service"
    >
       {image_url ? (
        <div className="relative w-full h-64 flex items-center justify-center overflow-hidden rounded-xl">
          <Image
            src={image_url}
            alt={title || 'Service Image'}
            height={400}
            width={400}
            className="object-cover object-top"
          />
        </div>
      ) : (
        <div className="relative w-full h-20 flex items-center justify-center">
          {Icon && (
            <Icon className="text-white h-16 w-16 bg-darkclip rounded-md border-white border-2 p-2" />
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 w-full p-6 md:p-8 justify-between gap-4 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <h3 itemProp="name" className="text-2xl font-bold text-white mb-2">
            {title}
          </h3>

          <p
            itemProp="description"
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {short_description}
          </p>
        </div>

        {keywords.length > 0 && (
          <div className="w-full flex flex-wrap gap-2 mt-4" aria-label="Service keywords">
            {keywords.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className={cn(
                  'p-1 text-xs rounded-full font-medium',
                  tagColors[i % tagColors.length]
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {serviceUrl && (
          <div className="mt-4">
            <span className="text-sm text-indigo-400 font-semibold inline-flex items-center hover:underline">
              Learn more →
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
