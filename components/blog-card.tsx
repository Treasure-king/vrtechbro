'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { BlogCardProps } from '@/types/blog-card'
import { Calendar, Clock } from 'lucide-react'

const tagColors = [
  'bg-accent-primary/10 text-accent-primary',
  'bg-success/10 text-success',
  'bg-accent-secondary/10 text-accent-secondary',
  'bg-warning/10 text-warning',
  'bg-[oklch(0.70_0.15_200)]/10 text-[oklch(0.70_0.15_200)]',
  'bg-error/10 text-error',
]

export function BlogCard({
  title,
  description,
  tags = [],
  published_at,
  reading_time,
  slug,
  delay = 0,
}: BlogCardProps) {
  const blogUrl = `/blog/${slug}`
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : delay }}
      className={cn(
        'group bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-xl hover:shadow-accent-primary/5'
      )}
    >
      <Link
        href={blogUrl}
        aria-label={`Read blog post: ${title}`}
        className="flex flex-col h-full p-6"
      >
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={cn(
                  'px-2.5 py-1 rounded-full font-medium text-xs',
                  tagColors[i % tagColors.length]
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-display font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors duration-200 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>

        {/* Footer: Date + Reading Time */}
        <footer className="mt-5 pt-4 border-t border-border-subtle flex items-center gap-4 text-xs text-text-muted">
          {published_at && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={new Date(published_at).toISOString()}>
                {new Date(published_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </span>
          )}
          {reading_time && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {reading_time} min read
            </span>
          )}
        </footer>
      </Link>
    </motion.article>
  )
}
