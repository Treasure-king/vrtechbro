import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { BlogCard } from '@/components/blog-card'
import { BlogCardProps } from '@/types/blog-card'

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

export const revalidate = 3600;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'VRTechBro Blog',
  url: 'https://www.vrtechbro.com/blog',
  description:
    'Read developer insights, engineering tips, and backend/frontend articles from the VRTechBro team.',
  publisher: {
    '@type': 'Organization',
    name: 'VRTechBro',
    url: 'https://www.vrtechbro.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.vrtechbro.com/logo.png',
    },
  },
}

export default async function BlogPage() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('published_at', { ascending: false })

  return (
    <>
      {/* Blog structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-6 py-24">
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-center mb-14 text-text-primary">
          Latest <span className="text-gradient">Blogs</span>
        </h1>

        {!blogs || blogs.length === 0 ? (
          <p className="text-center text-info text-lg">No blog posts available.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {blogs.map((blog: BlogCardProps, index: number) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                description={blog.description}
                slug={blog.slug}
                published_at={blog.published_at}
                tags={blog.tags || []}
                delay={index * 0.05}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
