'use client'

import { motion, scale } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ServiceCardProps {
  title: string
  description: string
  icon?: LucideIcon
  imageUrl?: any
  href?: string
  tags?: string[]
  className?: string
  delay?: number
}

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
  description,
  icon: Icon,
  imageUrl,
  href,
  tags = [],
  delay = 0,
}: ServiceCardProps) {
  const card = (

    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025 }}
      transition={{ duration: 0.25, delay }}
      className=
      'flex flex-col justify-between w-full hover:bg-darkclip rounded-2xl overflow-hidden shadow-xl/30 hover:shadow-white transition-all duration-300 p-4'
    >
      {/* Icon */}
      {imageUrl ? (
        <div className="relative w-full h-72 flex items-center justify-center overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={title}
            height={500}
            width={500}
            className="object-cover object-top"
          />
        </div>)
        :
        (
          <div className="relative w-full h-20 flex items-center justify-center">
            {Icon && (
              <Icon className="text-white h-16 w-16 bg-darkclip rounded-md border-white border-2 p-2" />
            )}
          </div>
        )
      }

      {/* Content Area */}
      <div className="flex flex-col flex-1 w-full p-6 md:p-8 justify-between gap-4 overflow-hidden">
        {/* Title & Description */}
        <div className="flex-1 overflow-hidden">
          <h3 className="text-2xl font-bold text-white mb-2 truncate">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {description}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={cn(
                  'px-3 py-1 text-xs rounded-full font-medium',
                  tagColors[i % tagColors.length]
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>

  )

  return href ? <Link href={href}>{card}</Link> : card
}
