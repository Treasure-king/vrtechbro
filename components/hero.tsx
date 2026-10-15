import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import vrTechBro from '@/public/images/vrTechBro-bg-remove.webp';

export function Hero() {
  return (
    <section
      role="region"
      aria-label="VRTechBro Hero Section - Empowering Your Digital Future"
      className="relative min-h-[90vh] flex items-center justify-center py-24 sm:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary" />

      {/* Radial glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-glow opacity-60" />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-6 lg:px-8">
        {/* Logo image with optimized loading */}
        <Image
          src={vrTechBro}
          alt="VRTechBro logo - Empowering Your Digital Future"
          width={160}
          height={160}
          sizes="160px"
          priority
          className="mx-auto drop-shadow-[0_0_30px_oklch(0.68_0.19_275/25%)]"
        />

        {/* Main headline */}
        <h1
          className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight tracking-tight text-text-primary"
        >
          Empowering Your{' '}
          <span className="text-gradient">Digital Future</span>
        </h1>

        {/* Subheadline */}
        <p
          className="mt-5 md:mt-6 max-w-2xl mx-auto text-lg text-text-secondary leading-relaxed"
        >
          We build scalable websites, applications, and cloud solutions tailored to accelerate your business growth with modern technologies like Next.js, React, Node.js, and more.
        </p>

        {/* Call-to-action buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" passHref aria-label="Contact VRTechBro to collaborate on your project">
            <Button size="lg">
              Let&apos;s Work Together
            </Button>
          </Link>
          <Link href="/services" passHref aria-label="Explore VRTechBro services">
            <Button variant="secondary" size="lg">
              Our Services
            </Button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center" aria-hidden="true">
          <div className="w-6 h-10 rounded-full border-2 border-text-muted/40 flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-accent-primary rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
