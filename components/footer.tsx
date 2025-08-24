import Link from 'next/link'
import {
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
} from 'react-icons/fa'
export function Footer() {
  return (
    <>
      <footer className="bg-dark text-gray-400 border-t border-slate-700" role="contentinfo">
        <div className="container mx-auto p-6 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} vrtechbro. All rights reserved.</p>

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
              href="https://www.linkedin.com/company/vrtechbro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="vrtechbro on LinkedIn"
              className="hover:text-white transition-colors"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="https://www.instagram.com/vrtechbro_official"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="vrtechbro on Instagram"
              className="hover:text-white transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://github.com/vrtechbro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="vrtechbro on GitHub"
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
            "name": "vrtechbro",
            "url": "https://www.vrtechbro.com",
            "logo": "https://www.vrtechbro.com/logo.png",
            "sameAs": [
              "https://www.linkedin.com/company/vrtechbro",
              "https://www.instagram.com/vrtechbro_official",
              "https://github.com/vrtechbro"
            ]
          }),
        }}
      />
    </>
  )
}
