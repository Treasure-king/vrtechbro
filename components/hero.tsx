'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import vrTechBro from '../public/images/vrTechBro-bg-remove.png';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <header
      role="banner"
      className="min-h-screen bg-linear-to-b from-dark to-darkclip flex items-center justify-center text-text py-20 sm:py-24 [clip-path:polygon(0_0,_100%_0,_100%_95%,_0_100%)]"
    >
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-6 lg:px-8">
        {/* ✅ Don't animate this image */}
        <Image
          src={vrTechBro}
          alt="VRTechBro logo - Empowering Your Digital Future"
          width={180}
          height={180}
          priority
          quality={90}
          placeholder="blur"
          className="mx-auto"
        />

        {/* ✅ Don't animate the h1 */}
        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
          Empowering Your Digital Future
        </h1>

        {/* ✅ Animate below-the-fold elements only */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg text-gray-300"
        >
          We build scalable websites, applications, and cloud solutions tailored to accelerate your business growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-8 flex justify-center"
        >
          <Link href="/contact" passHref aria-label="Contact VRTechBro to collaborate">
            <Button size="lg" className="btn">
              Let’s Work Together
            </Button>
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
