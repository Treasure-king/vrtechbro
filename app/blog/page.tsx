// app/blog/page.tsx
import { Metadata } from 'next'
import BlogClient from '@/components/BlogClient'

export const metadata: Metadata = {
  title: 'Tech Blogs & Insights | VRTechBro',
  description:
    'Read expert blogs by VRTechBro on web development, Next.js, backend systems, Supabase, frontend engineering, and digital innovation.',
  keywords: [
    'tech blog',
    'VRTechBro blog',
    'web development articles',
    'Next.js tutorials',
    'Supabase blogs',
    'software engineering',
    'frontend development',
    'backend architecture',
    'digital innovation',
  ],
  openGraph: {
    title: 'Tech Blogs & Developer Insights | VRTechBro',
    description:
      'Explore the latest tech blogs from VRTechBro: insights on modern stacks, frontend frameworks, scalable architecture, and digital product engineering.',
    url: 'https://www.vrtechbro.com/blog',
    siteName: 'VRTechBro',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VRTechBro Blog – Modern Tech Insights',
    description:
      'VRTechBro shares modern development insights on React, Supabase, backend systems, cloud tools, and scalable web app strategies.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogPage() {
  return <BlogClient />
}
