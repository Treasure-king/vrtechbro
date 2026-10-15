'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

const itemClass =
  'inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary rounded'

/** Share the current article on X or LinkedIn, or copy its link. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col">
      <li>
        <a
          href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={itemClass}
        >
          <FaXTwitter className="h-4 w-4" aria-hidden="true" />
          Share on X
        </a>
      </li>
      <li>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={itemClass}
        >
          <FaLinkedinIn className="h-4 w-4" aria-hidden="true" />
          Share on LinkedIn
        </a>
      </li>
      <li>
        <button type="button" onClick={copy} className={`${itemClass} cursor-pointer`}>
          {copied ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
        </button>
      </li>
    </ul>
  )
}
