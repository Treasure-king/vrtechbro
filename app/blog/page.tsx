'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'motion/react'
import { BlogCardProps } from '@/types/blog-card'
import { BlogCard } from '@/components/blog-card'

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogCardProps[]>([])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('published_at', { ascending: false })

    if (!error && data) setBlogs(data as BlogCardProps[])
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-text">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-4xl font-bold text-center mb-12"
      >
        Latest Blogs
      </motion.h1>

      {blogs.length === 0 ? (
        <p className="text-center text-info text-lg">No blog posts available.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: 'easeOut',
              }}
              className="h-full"
            >
              <BlogCard
                title={blog.title}
                description={blog.description}
                slug={blog.slug}
                published_at={blog.published_at}
                tags={blog.tags || []}
                delay={index * 0.05}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
