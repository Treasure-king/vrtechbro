'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import vrTechBro from '../public/images/vrTechBro-bg-remove.png'

const links = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Blogs', href: '/blog' },
  { name: 'About Us', href: '/about' },
  { name: 'FAQ', href: '/faq' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header
      role="banner"
      className="bg-transparent backdrop-blur-md text-white sticky top-0 z-50 border-b-2 border-primary"
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" aria-label="VR Tech Bro Home">
            <Image
              src={vrTechBro}
              alt="VR Tech Bro Logo"
              width={80}
              priority
              loading="eager"
            />
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.nav
          className="hidden md:flex gap-6 items-center"
          aria-label="Primary navigation"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75 }}
        >
          {links.map(link => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? 'page' : undefined} // Helpful for screen readers & SEO
                className={`relative group transition font-medium text-shadow-2xs ${
                  isActive
                    ? 'text-primaryHover text-shadow-white'
                    : 'text-white text-shadow-amber-500'
                }`}
                tabIndex={0}
              >
                {link.name}
                <span
                  className={`pointer-events-none absolute left-1/2 -bottom-1 h-0.5 w-full max-w-full origin-center transition-transform duration-500 ease-out transform -translate-x-1/2 ${
                    isActive ? 'bg-primaryHover scale-x-100' : 'bg-white scale-x-0 group-hover:scale-x-100'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            )
          })}

          <Link href="/contact" tabIndex={0}>
            <Button variant="secondary" className="btn" aria-label="Login to your account">
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
          className="md:hidden focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.nav
          id="mobile-menu"
          aria-label="Mobile primary navigation"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="md:hidden bg-dark p-4 rounded-b-2xl shadow-xl space-y-3"
        >
          {links.map(link => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-text px-3 py-2 rounded-md transition duration-300 hover:text-accent hover:bg-card/60"
                aria-current={pathname === link.href ? 'page' : undefined}
                tabIndex={0}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/contact" tabIndex={0}>
              <Button
                variant="secondary"
                className="mt-2 w-full btn"
                aria-label="Login to your account"
              >
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </motion.nav>
      )}
    </header>
  )
}
