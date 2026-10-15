import { cn } from '@/lib/utils'

/**
 * Placeholder illustration for services without an image: a wireframe of
 * stacked layers (interface, logic, data). Swap for real artwork when available.
 */
export function ServiceArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      aria-hidden="true"
      className={cn('h-full w-full', className)}
    >
      <defs>
        <linearGradient id="service-art-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.19 275)" />
          <stop offset="100%" stopColor="oklch(0.72 0.16 330)" />
        </linearGradient>
      </defs>
      {/* Base layer: data */}
      <path d="M200 236 L332 172 L200 108 L68 172 Z" stroke="oklch(0.30 0.015 270)" strokeWidth="1.5" />
      {/* Middle layer: logic */}
      <path d="M200 196 L332 132 L200 68 L68 132 Z" stroke="oklch(0.50 0.01 260)" strokeWidth="1.5" />
      {/* Top layer: interface */}
      <path
        d="M200 156 L332 92 L200 28 L68 92 Z"
        fill="oklch(0.68 0.19 275 / 12%)"
        stroke="url(#service-art-accent)"
        strokeWidth="2"
      />
      {/* Connectors */}
      {[68, 200, 332].map((x) => (
        <line key={x} x1={x} y1={x === 200 ? 156 : 92} x2={x} y2={x === 200 ? 236 : 172} stroke="oklch(0.30 0.015 270)" strokeDasharray="3 5" />
      ))}
      {/* Interface details on the top layer */}
      <path d="M150 92 L200 68 L250 92" stroke="oklch(0.95 0.005 260 / 70%)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="200" cy="112" r="6" fill="url(#service-art-accent)" />
    </svg>
  )
}
