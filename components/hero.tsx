'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import vrTechBro from '../public/images/vrTechBro-bg-remove.png'

export function Hero() {
  return (
      <section className="h-screen bg-linear-to-b from-dark to-darkclip flex items-center justify-center text-text py-20 sm:py-24 [clip-path:polygon(0_0,_100%_0,_100%_90%,_0_100%)] ">
        <div className="w-full flex flex-col z-10 text-center items-center px-6 lg:px-8">
          <motion.div
              initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          <Image
            src={vrTechBro}
            alt="vrTechBro"
            width={180}
            />
            </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white text-shadow-lg/30 text-shadow-yellow-500"
            >
            Empowering Your Digital Future
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-gray-400"
          >
            We build websites, apps, and cloud solutions that scale with your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex justify-center"
            >
            <Link href="/contact" passHref>
              <Button size="lg" className='btn'>Let’s Work Together</Button>
            </Link>
          </motion.div>
        </div>
      </section>
  )
}
