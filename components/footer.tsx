import Link from 'next/link'
import {
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
} from 'react-icons/fa'

import {FaMeta,FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <>
      <footer className="bg-dark text-gray-400 border-t border-slate-700" role="contentinfo">
        <div className="container mx-auto p-6 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} TechEdge. All rights reserved.</p>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-6">
            <Link href="/privacy-policy" className="hover:text-white focus:outline-2 focus:outline-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white focus:outline-2 focus:outline-primary">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-white focus:outline-2 focus:outline-primary">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-white focus:outline-2 focus:outline-primary">
              Contact
            </Link>
          </nav>

          <div className="flex gap-4" aria-label="Social media links">
            <a
              href="https://www.facebook.com/TechEdge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TechEdge on Facebook"
              className="hover:text-white transition-colors"
            >
              <FaMeta size={20} />
            </a>
            <a
              href="https://twitter.com/TechEdge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TechEdge on Twitter"
              className="hover:text-white transition-colors"
            >
              <FaXTwitter size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/techedge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TechEdge on LinkedIn"
              className="hover:text-white transition-colors"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="https://www.instagram.com/TechEdge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TechEdge on Instagram"
              className="hover:text-white transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://github.com/TechEdge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TechEdge on GitHub"
              className="hover:text-white transition-colors"
            >
              <FaGithub size={20} />
            </a>
          </div>
        </div>
      </footer>

      {/* JSON-LD structured data for Organization */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "TechEdge",
            "url": "https://www.techedge.com",
            "logo": "https://www.techedge.com/logo.png",
            "sameAs": [
              "https://www.facebook.com/TechEdge",
              "https://twitter.com/TechEdge",
              "https://www.linkedin.com/company/techedge",
              "https://www.instagram.com/TechEdge",
              "https://github.com/TechEdge"
            ]
          }),
        }}
      />
    </>
  )
}
