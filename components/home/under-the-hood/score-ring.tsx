'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Counter } from '@/components/motion/counter'
import { cn } from '@/lib/utils'

/** One Lighthouse category as a ring that fills to its score when scrolled into view. */
export function ScoreRing({ score, label }: { score: number; label: string }) {
  const reduce = useReducedMotion()
  // Same bands Lighthouse uses: 90–100 good, 50–89 needs work, below 50 poor
  const tone = score >= 90 ? 'text-signal' : score >= 50 ? 'text-warning' : 'text-error'

  return (
    <figure className="flex flex-col items-center gap-3 text-center">
      <div className={cn('relative h-28 w-28', tone)}>
        <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="56" cy="56" r="46" fill="none" stroke="var(--brand-line)" strokeWidth="6" />
          <motion.circle
            cx="56"
            cy="56"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            initial={reduce ? { pathLength: score / 100 } : { pathLength: 0 }}
            whileInView={{ pathLength: score / 100 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="text-text-primary absolute inset-0 flex items-center justify-center font-display text-3xl font-bold tabular-nums">
          <Counter to={score} />
        </span>
      </div>
      <figcaption className="text-text-secondary text-sm">
        {label}
        <span className="sr-only">: {score} out of 100</span>
      </figcaption>
    </figure>
  )
}
