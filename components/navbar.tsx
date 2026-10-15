'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import vrTechBro from '@/public/images/vrTechBro-bg-remove.webp'
import { NAV_LINKS } from '@/lib/constants'

const links = NAV_LINKS

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      role="banner"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass py-2 shadow-lg shadow-black/20'
          : 'bg-bg-primary/80 backdrop-blur-md py-3'
      }`}
    >
      {/* Gradient bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent" />

      <div className="container mx-auto flex items-center justify-between px-4">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" aria-label="VRTechBro Home" className="group">
            <Image
              src={vrTechBro}
              alt="VRTechBro Logo"
              width={scrolled ? 60 : 72}
              height={scrolled ? 60 : 72}
              sizes="80px"
              priority
              loading="eager"
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_12px_oklch(0.68_0.19_275/40%)]"
            />
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.nav
          className="hidden md:flex gap-8 items-center"
          aria-label="Primary navigation"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {links.map(link => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative group transition-colors duration-200 text-sm font-medium ${
                  isActive
                    ? 'text-accent-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                tabIndex={0}
              >
                {link.name}
                {/* Underline animation: width 0 → 100% from center */}
                <span
                  className={`pointer-events-none absolute left-0 -bottom-1.5 h-0.5 w-full origin-center rounded-full transition-transform duration-300 ease-out ${
                    isActive
                      ? 'bg-accent-primary scale-x-100'
                      : 'bg-accent-primary/60 scale-x-0 group-hover:scale-x-100'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            )
          })}

          <Link href="/contact" tabIndex={0}>
            <Button size="sm" aria-label="Get in touch with VRTechBro">
              Get in Touch
            </Button>
          </Link>
        </motion.nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="md:hidden text-text-primary p-2 rounded-lg hover:bg-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu — Full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-bg-primary/95 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-5 right-5 z-50 text-text-primary p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
            >
              <X size={24} />
            </button>

            {/* Nav links */}
            <nav
              aria-label="Mobile primary navigation"
              className="relative z-50 flex flex-col items-center justify-center h-full gap-6"
            >
              {links.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.3,
                    delay: shouldReduceMotion ? 0 : i * 0.05,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-2xl font-display font-semibold tracking-tight transition-colors duration-200 ${
                      pathname === link.href
                        ? 'text-accent-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    tabIndex={0}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.3,
                  delay: shouldReduceMotion ? 0 : links.length * 0.05,
                }}
              >
                <Link href="/contact" tabIndex={0}>
                  <Button
                    size="lg"
                    aria-label="Get in touch with VRTechBro"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get in Touch
                  </Button>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
