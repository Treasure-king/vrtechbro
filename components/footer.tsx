import Link from 'next/link'
import {
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
} from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";
import { SOCIAL_LINKS, COMPANY_LEGAL_NAME, CONTACT_EMAIL } from '@/lib/constants'
import { Mail } from 'lucide-react'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Blog', href: '/blog' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
]

const serviceLinks = [
  { name: 'Web Development', href: '/services' },
  { name: 'Mobile Apps', href: '/services' },
  { name: 'Cloud Solutions', href: '/services' },
  { name: 'UI/UX Design', href: '/services' },
  { name: 'SEO & Marketing', href: '/services' },
]

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'FAQ', href: '/faq' },
]

const socialItems = [
  {
    icon: FaLinkedinIn,
    href: SOCIAL_LINKS.linkedin,
    label: 'VRTechBro on LinkedIn',
    hoverColor: 'hover:text-[#0A66C2]',
  },
  {
    icon: FaInstagram,
    href: SOCIAL_LINKS.instagram,
    label: 'VRTechBro on Instagram',
    hoverColor: 'hover:text-[#E4405F]',
  },
  {
    icon: FaGithub,
    href: SOCIAL_LINKS.github,
    label: 'VRTechBro on GitHub',
    hoverColor: 'hover:text-white',
  },
  {
    icon: FaXTwitter,
    href: SOCIAL_LINKS.twitter,
    label: 'VRTechBro on X',
    hoverColor: 'hover:text-white',
  },
]

export function Footer() {
  return (
    <footer className="relative bg-bg-primary border-t border-border-subtle" role="contentinfo">
      {/* Gradient top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent" />

      <div className="container mx-auto px-4 pt-16 pb-8">
        {/* Multi-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-display font-bold text-text-primary mb-4">
              VRTechBro
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xs">
              A modern digital studio building custom software, web & mobile apps, and scalable cloud solutions.
            </p>

            {/* Newsletter placeholder */}
            <div className="space-y-2">
              <p className="text-text-muted text-xs font-medium uppercase tracking-wider">
                Stay Updated
              </p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-bg-secondary border border-border-subtle rounded-lg px-3 py-2">
                  <Mail className="h-4 w-4 text-text-muted shrink-0" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-full"
                    aria-label="Email for newsletter"
                    disabled
                  />
                </div>
                <button
                  className="gradient-primary text-white text-sm font-medium px-4 rounded-lg opacity-60 cursor-not-allowed"
                  disabled
                  aria-label="Subscribe to newsletter (coming soon)"
                >
                  Soon
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-display font-semibold text-text-primary uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <nav aria-label="Footer quick links">
              <ul className="space-y-2.5">
                {quickLinks.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-sm font-display font-semibold text-text-primary uppercase tracking-wider mb-4">
              Services
            </h3>
            <nav aria-label="Footer services links">
              <ul className="space-y-2.5">
                {serviceLinks.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 4: Legal & Social */}
          <div>
            <h3 className="text-sm font-display font-semibold text-text-primary uppercase tracking-wider mb-4">
              Legal
            </h3>
            <nav aria-label="Footer legal links">
              <ul className="space-y-2.5 mb-6">
                {legalLinks.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-accent-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <p className="text-sm text-text-secondary mb-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-accent-primary transition-colors duration-200"
              >
                {CONTACT_EMAIL}
              </a>
            </p>

            {/* Social Icons */}
            <div className="flex gap-3" aria-label="Social media links">
              {socialItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className={`text-text-muted ${item.hoverColor} transition-colors duration-200 p-2 rounded-lg hover:bg-bg-tertiary`}
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} {COMPANY_LEGAL_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Built with Next.js, Supabase & ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}
