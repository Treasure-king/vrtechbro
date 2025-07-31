'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import { Hero } from '@/components/hero'
import { ServiceCard } from '@/components/service-card'
import { BlogCard } from '@/components/blog-card'
import { ContactForm } from '@/components/contact-form'
import {
  Code,
  Smartphone,
  BrainCircuit,
  Cloud,
  Search,
  UserPen,
  Earth,
  ShoppingCart,
  Bot,
} from 'lucide-react'
import TechTags from '@/components/TechTags'

export default function HomePage() {
  const [services, setServices] = useState<any[]>([])
  const [blogs, setBlogs] = useState<any[]>([])

  const iconMap = {
    Code,
    Smartphone,
    BrainCircuit,
    Cloud,
    Search,
    UserPen,
    Earth,
    ShoppingCart,
    Bot
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('featured', true) // ✅ filter only featured services
      .order('created_at', { ascending: false })
      .limit(3)
    const { data: blogsData, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .limit(3)


    if (!servicesError) setServices(servicesData || [])
    console.log(services);
    if (!blogsError) setBlogs(blogsData || [])
  }

  return (
    <div className="min-h-screen selection:bg-pink-500">
      <Hero />
      <TechTags />

      {/* 👥 About Us Section */}
      <section className="relative text-white overflow-hidden">
        {/* Top Wave Background */}
        <svg
          className="absolute inset-0 w-full h-full -z-10"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 600"
        >
          <defs>
            <linearGradient id="lightIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" /> {/* indigo-100 */}
              <stop offset="100%" stopColor="#dbeafe" /> {/* indigo-400 */}
            </linearGradient>
          </defs>
          <path
            fill="url(#lightIndigo)"
            d="M 0 0 C 300,30 300,0 700,0 C 980,0 900,0 1080,10 C1440,40 1440,0 1440,0 L1440,600 L0,600 Z"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 md:px-10 py-20 max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80"
            alt="Tech Visual"
            className="w-full md:w-1/2 rounded-3xl shadow-2xl object-cover"
          />
          <div className="text-center md:text-left md:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Us</h2>
            <p className="text-base text-justify sm:text-lg text-white leading-relaxed">
              We are a future-driven technology company where innovation meets imagination. By combining design-led thinking with robust engineering, we create intuitive digital experiences that engage users, empower businesses, and solve real-world challenges with elegance and efficiency. Our mission is to shape the digital future by pushing boundaries, embracing emerging technologies, and delivering solutions that are not only functional but also emotionally resonant. With a passion for quality and a focus on impact, we transform ideas into intelligent products that drive growth and create lasting value.
            </p>
          </div>
        </div>

        {/* Bottom Wave Background (Flipped Top Wave) */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[20vh] -z-10 rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 600"
        >
          <path
            fill="url(#lightIndigo)"
            d="M 0 20 C 80,0 60,0 540,60 C 820,30 900,240 1080,160 C1260,80 1440,240 1440,240 L1440,0 L0,0 Z"
          />
        </svg>
      </section>


      {/* 🔧 Services Section */}
      <section className="py-20 text-text">
        <div className="container px-4 mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-14">Our Services</h2>
          <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 place-items-center gap-5">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap];

              return (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  imageUrl={service.image_url}
                  icon={IconComponent}
                  tags={service.tags || []}
                  delay={index * 0.15}
                />
              );
            })}
          </div>

          {/* View More Button for Services */}
          <div className="flex justify-center mt-10">
            <a
              href="/services"
              className="group relative inline-flex items-center gap-1 px-6 py-3 btn rounded-lg transition-all duration-300 overflow-hidden"
            >
              <span className="z-10">Explore More</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 📰 Blogs Section */}
      <section className="py-20 text-text">
        <div className="container px-4 mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-14">From the Blog</h2>
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
            {blogs.map((blog, index) => (
              <BlogCard
                key={blog.slug}
                title={blog.title}
                description={blog.description}
                slug={blog.slug}
                publishedAt={blog.published_at}
                tags={blog.tags || []}
                delay={index * 0.15}
              />
            ))}
          </div>

          {/* View More Button for Blogs */}
          <div className="flex justify-center mt-10">
            <a
              href="/blog"
              className="group relative inline-flex items-center gap-q px-6 py-3 btn rounded-lg transition-all duration-300 overflow-hidden"
            >
              <span className="z-10">Explore More</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 📬 Contact Section */}
      <section className="py-20 text-text">
        <div className="container px-4 mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-10">Let’s Work Together</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
