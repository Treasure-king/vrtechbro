'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BlogCardProps } from '@/types/blog-card'

const tagColors = [
  'bg-blue-500/10 text-blue-400',
  'bg-green-500/10 text-green-400',
  'bg-purple-500/10 text-purple-400',
  'bg-pink-500/10 text-pink-400',
  'bg-yellow-500/10 text-yellow-400',
  'bg-red-500/10 text-red-400',
]

export function BlogCard({
  title,
  description,
  slug,
  tags = [],
  published_at,
  delay
}: BlogCardProps) {
  return (
    // <Link href={`/blogs/${slug}`} passHref>
      <motion.article
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay}}
        className={
          'hover:bg-darkclip rounded-2xl overflow-hidden shadow-xl/30 hover:shadow-white transition-all duration-300 p-4 h-full flex flex-col justify-between text-text'}
      >
        {/* Title & Description */}
        <div>
          <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </div>

        {/* Tags & Date */}
        <div className="mt-6 flex flex-wrap justify-between items-center gap-3 text-sm">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={cn(
                  'px-3 py-1 rounded-full font-medium text-xs',
                  tagColors[i % tagColors.length]
                )}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Date */}
          {published_at && (
            <time className="text-xs text-gray-500">
              {new Date(published_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
      </motion.article>
    // </Link>
  )
}
