'use client'

import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="bg-dark text-white py-20">
      <section className="max-w-4xl mx-auto px-6 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Our Studio
        </motion.h1>

        <motion.p
          className="text-lg text-gray-400 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          We’re a modern digital studio crafting next-generation websites, apps, and backend solutions for businesses worldwide. Our mission is to turn complex problems into simple, scalable, and elegant experiences.
        </motion.p>
      </section>

      <section className="max-w-5xl mx-auto px-6 grid sm:grid-cols-2 gap-8">
        <div className="bg-card border border-slate-700 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-3">🚀 Our Mission</h3>
          <p className="text-gray-300">
            To empower businesses with scalable, performant, and beautifully designed digital products that accelerate growth.
          </p>
        </div>
        <div className="bg-card border border-slate-700 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-3">💡 Our Vision</h3>
          <p className="text-gray-300">
            To be recognized globally as a go-to tech partner for innovative and reliable web & mobile solutions.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Technologies We Love</h2>
        <p className="text-gray-400 mb-6">
          We build with performance, scalability, and maintainability in mind.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
          <span className="bg-slate-800 px-3 py-1 rounded-full">Next.js</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full">TypeScript</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full">Tailwind CSS</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full">Supabase</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full">MongoDB</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full">Framer Motion</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full">Resend</span>
        </div>
      </section>
    </div>
  )
}
