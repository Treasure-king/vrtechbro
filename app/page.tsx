'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Hero } from '@/components/hero'
import { ServiceCard } from '@/components/service-card'
import { BlogCard } from '@/components/blog-card'
import { ContactForm } from '@/components/contact-form'
import TechTags from '@/components/TechTags'
import AboutUs from '@/public/images/AboutUs.png'
import Image from 'next/image'
import { ServiceCardProps } from '@/types/service-card'
import { BlogCardProps } from '@/types/blog-card'
import { iconMap } from '@/lib/helper'
import Link from 'next/link'

export default function HomePage() {
  const [services, setServices] = useState<ServiceCardProps[]>([]);
  const [blogs, setBlogs] = useState<BlogCardProps[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: true })
      .limit(3);

    const { data: blogsData, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .limit(3);

    if (!servicesError) setServices(servicesData || []);
    if (!blogsError) setBlogs(blogsData || []);
  };

  return (
    <div className="min-h-screen selection:bg-pink-500">
      <Hero />

      <TechTags />

      {/* 👤 About Section */}
      <section aria-labelledby="about-title" className="relative text-white overflow-hidden">
        <svg className="absolute inset-0 w-full h-full -z-10" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 600">
          <defs>
            <linearGradient id="lightIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>
          </defs>
          <path fill="url(#lightIndigo)" d="M 0 0 C 300,30 300,0 700,0 C 980,0 900,0 1080,10 C1440,40 1440,0 1440,0 L1440,600 L0,600 Z" />
        </svg>

        <div className="relative z-10 px-4 sm:px-6 md:px-10 py-20 max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          <Image
            src={AboutUs}
            alt="About VRTechBro - IT Services Company"
            className="w-full md:w-1/2 rounded-3xl shadow-2xl object-cover"
          />
          <div className="text-center md:text-left md:w-1/2">
            <h1 id="about-title" className="text-4xl sm:text-5xl font-bold mb-4">Your Trusted Full-Stack IT Partner</h1>
            <p className="text-base sm:text-lg text-white leading-relaxed text-justify">
              At VRTechBro, we help startups and enterprises transform ideas into intelligent, scalable, and secure software solutions.
              With expertise across technologies like <strong>Next.js</strong>, <strong>Node.js</strong>, <strong>Supabase</strong>, <strong>Python</strong>, and more, our full-stack team builds high-impact web & mobile apps, cloud platforms, and enterprise systems that fuel real-world success.
            </p>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 w-full h-[20vh] -z-10 rotate-180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 600">
          <path fill="url(#lightIndigo)" d="M 0 20 C 80,0 60,0 540,60 C 820,30 900,240 1080,160 C1260,80 1440,240 1440,240 L1440,0 L0,0 Z" />
        </svg>
      </section>

      {/* 🛠️ Services */}
      <section className="py-20 text-text" aria-labelledby="services-title">
        <div className="container px-4 mx-auto max-w-7xl">
          <h2 id="services-title" className="text-4xl font-bold text-center mb-14">Custom IT Services That Drive Results</h2>
          <p className="text-center max-w-3xl mx-auto text-lg mb-10 text-gray-400">
            Explore our featured services including full-stack development, backend integrations, mobile applications, and scalable SaaS platforms using modern technologies.
          </p>
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap];
              return (
                <ServiceCard
                  key={service.id}
                  slug={service.slug}
                  title={service.title}
                  short_description={service.short_description}
                  image_url={service.image_url}
                  icon={IconComponent}
                  keywords={service.keywords || []}
                  delay={index * 0.05}
                />  
              );
            })}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/services"
              className="group relative inline-flex items-center gap-1 px-6 py-3 btn rounded-lg transition-all duration-300 overflow-hidden"
            >
              <span className="z-10">Explore More Services</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 📰 Blog */}
      <section className="py-20 text-text" aria-labelledby="blog-title">
        <div className="container px-4 mx-auto max-w-7xl">
          <h2 id="blog-title" className="text-4xl font-bold text-center mb-14">Insights, Trends & Tech News</h2>
          <p className="text-center max-w-2xl mx-auto text-lg mb-8 text-gray-400">
            Stay ahead with expert-written articles on software development, emerging frameworks, cloud engineering, and tech strategy.
          </p>
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {blogs.map((blog, index) => (
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

          <div className="flex justify-center mt-10">
            <Link
              href="/blog"
              className="group relative inline-flex items-center gap-1 px-6 py-3 btn rounded-lg transition-all duration-300 overflow-hidden"
            >
              <span className="z-10">Read More Articles</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 📞 Contact CTA */}
      <section className="py-20 text-text" aria-labelledby="contact-title">
        <div className="container px-4 mx-auto max-w-6xl">
          <h2 id="contact-title" className="text-4xl font-bold text-center mb-6">Let’s Build Something Incredible</h2>
          <p className="text-center text-lg text-gray-400 mb-10">
            Need a reliable software development team? Let’s talk about your business needs and how VRTechBro can deliver value.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
