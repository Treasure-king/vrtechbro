'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

/* ------------------------------------------------------------------
 * The real request path of this site. Two hand-placed layouts share
 * the same nodes: wide (row) for ≥768px and tall (stack) for phones.
 * ------------------------------------------------------------------ */

type NodeId = 'browser' | 'vercel' | 'supabase' | 'resend'

type DiagramNode = { title: string; lines: string[]; emphasis?: boolean }

const NODES: Record<NodeId, DiagramNode> = {
  browser: { title: 'Your browser', lines: ['Gets pre-rendered HTML', 'Hydrates interactive parts'] },
  vercel: {
    title: 'Vercel',
    lines: ['Next.js 15 App Router', 'React Server Components', 'Security headers and CSP'],
    emphasis: true,
  },
  supabase: { title: 'Supabase', lines: ['Postgres database', 'Row-level security'] },
  resend: { title: 'Resend', lines: ['Transactional email', 'Contact and job forms'] },
}

type Box = { x: number; y: number; w: number; h: number }
type Edge = { d: string; label: string; lx: number; ly: number; anchor?: 'start' | 'middle' | 'end' }
type Layout = { width: number; height: number; boxes: Record<NodeId, Box>; edges: Edge[] }

const WIDE: Layout = {
  width: 960,
  height: 340,
  boxes: {
    browser: { x: 10, y: 120, w: 210, h: 100 },
    vercel: { x: 370, y: 105, w: 240, h: 130 },
    supabase: { x: 750, y: 20, w: 200, h: 100 },
    resend: { x: 750, y: 220, w: 200, h: 100 },
  },
  edges: [
    { d: 'M220 170 L370 170', label: 'HTTPS requests', lx: 295, ly: 158 },
    { d: 'M610 170 C680 170 680 70 750 70', label: 'Queries', lx: 690, ly: 92, anchor: 'end' },
    { d: 'M610 170 C680 170 680 270 750 270', label: 'Form emails', lx: 690, ly: 258, anchor: 'end' },
  ],
}

const TALL: Layout = {
  width: 360,
  height: 540,
  boxes: {
    browser: { x: 60, y: 10, w: 240, h: 84 },
    vercel: { x: 50, y: 170, w: 260, h: 112 },
    supabase: { x: 5, y: 380, w: 168, h: 100 },
    resend: { x: 187, y: 380, w: 168, h: 100 },
  },
  edges: [
    { d: 'M180 94 L180 170', label: 'HTTPS requests', lx: 190, ly: 136, anchor: 'start' },
    { d: 'M180 282 C180 330 89 330 89 380', label: 'Queries', lx: 98, ly: 330, anchor: 'end' },
    { d: 'M180 282 C180 330 271 330 271 380', label: 'Form emails', lx: 262, ly: 330, anchor: 'start' },
  ],
}

function DiagramSvg({ layout, active, reduce, className }: { layout: Layout; active: boolean; reduce: boolean; className: string }) {
  const titleId = `arch-title-${layout.width}`
  const descId = `arch-desc-${layout.width}`

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      className={className}
    >
      <title id={titleId}>How a request travels through this website</title>
      <desc id={descId}>
        Your browser sends HTTPS requests to Vercel, which runs the Next.js 15 App Router with React Server
        Components and adds the security headers. Vercel reads content from Supabase, a Postgres database protected
        by row-level security, and sends form emails through Resend.
      </desc>

      {/* Connectors */}
      {layout.edges.map((edge, i) => (
        <g key={edge.d}>
          <path d={edge.d} fill="none" stroke="var(--brand-line)" strokeWidth="2" />
          <motion.path
            d={edge.d}
            fill="none"
            stroke="var(--brand-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: active || reduce ? 1 : 0 }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
          <text
            x={edge.lx}
            y={edge.ly}
            textAnchor={edge.anchor ?? 'middle'}
            fill="var(--brand-text-muted)"
            fontSize="12"
          >
            {edge.label}
          </text>
        </g>
      ))}

      {/* Nodes */}
      {(Object.keys(NODES) as NodeId[]).map((id) => {
        const node = NODES[id]
        const box = layout.boxes[id]
        return (
          <g key={id}>
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              rx="12"
              fill="var(--brand-surface)"
              stroke={node.emphasis ? 'var(--brand-primary)' : 'var(--brand-line-strong)'}
              strokeWidth={node.emphasis ? 1.5 : 1}
            />
            <text x={box.x + 16} y={box.y + 28} fill="var(--brand-text)" fontSize="15" fontWeight="700">
              {node.title}
            </text>
            {node.lines.map((line, li) => (
              <text key={line} x={box.x + 16} y={box.y + 52 + li * 20} fill="var(--brand-text-secondary)" fontSize="12">
                {line}
              </text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

/** Architecture diagram whose connectors draw themselves when scrolled into view. */
export function ArchitectureDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const active = useInView(ref, { once: true, margin: '-100px' })
  const reduce = useReducedMotion() ?? false

  return (
    <div ref={ref} className="font-sans">
      <DiagramSvg layout={WIDE} active={active} reduce={reduce} className="hidden h-auto w-full md:block" />
      <DiagramSvg layout={TALL} active={active} reduce={reduce} className="mx-auto h-auto w-full max-w-sm md:hidden" />
    </div>
  )
}
