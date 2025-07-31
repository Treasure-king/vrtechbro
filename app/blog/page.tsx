'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'motion/react'

type Blog = {
  id: string
  title: string
  content: string
  slug: string
  created_at: string
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('published_at', { ascending: false })

    if (!error && data) setBlogs(data as Blog[])
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y:40 }}
              animate={{ opacity: 1, y:0 }}
              transition={{
                duration: 0.05,
                delay: 0.3 + i * 0.5,
                ease: 'easeOut',
              }}
              className="bg-transparent text-text rounded-2xl p-6 border border-darkclip shadow-lg hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] hover:scale-[1.03] transition-all duration-300 backdrop-blur-md"
            >
              <h2 className="text-2xl font-semibold mb-2 selection:bg-pink-400">{blog.title}</h2>
              <p className="text-sm text-info mb-3">
                {new Date(blog.published_at).toLocaleDateString()}
              </p>
              <p className="text-sm line-clamp-4 leading-relaxed mb-4 selection:bg-pink-600">
                {blog.description}
              </p>
              <a
                href={`/blogs/${blog.slug}`}
                className="inline-block text-white hover:text-primaryHover font-medium hover:underline transition"
              >
                Read more →
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
