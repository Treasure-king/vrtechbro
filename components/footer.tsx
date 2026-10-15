import Link from "next/link";
import { FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  SOCIAL_LINKS,
  COMPANY_LEGAL_NAME,
  CONTACT_EMAIL,
} from "@/lib/constants";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

const serviceLinks = [
  { name: "Web development", href: "/services" },
  { name: "Mobile apps", href: "/services" },
  { name: "Cloud solutions", href: "/services" },
  { name: "UI/UX design", href: "/services" },
  { name: "SEO and marketing", href: "/services" },
];

const legalLinks = [
  { name: "Privacy policy", href: "/privacy-policy" },
  { name: "Terms of service", href: "/terms" },
  { name: "FAQ", href: "/faq" },
];

const socialItems = [
  {
    icon: FaLinkedinIn,
    href: SOCIAL_LINKS.linkedin,
    label: "VRTechBro on LinkedIn",
    hoverColor: "hover:text-[#0A66C2]",
  },
  {
    icon: FaInstagram,
    href: SOCIAL_LINKS.instagram,
    label: "VRTechBro on Instagram",
    hoverColor: "hover:text-[#E4405F]",
  },
  {
    icon: FaGithub,
    href: SOCIAL_LINKS.github,
    label: "VRTechBro on GitHub",
    hoverColor: "hover:text-white",
  },
  {
    icon: FaXTwitter,
    href: SOCIAL_LINKS.twitter,
    label: "VRTechBro on X",
    hoverColor: "hover:text-white",
  },
];
export function Footer() {
  const columns = [
    { title: "Studio", label: "Footer studio links", links: quickLinks },
    { title: "Services", label: "Footer services links", links: serviceLinks },
    { title: "Legal and help", label: "Footer legal links", links: legalLinks },
  ];

  return (
    <footer
      className="border-border-subtle bg-bg-primary border-t"
      role="contentinfo"
    >
      <div className="container-page pt-20 pb-8">
        {/* Closing line: the one thing we want every visitor to leave with */}
        <div className="border-border-subtle flex flex-col gap-6 border-b pb-14 md:flex-row md:items-end md:justify-between">
          <p className="type-heading text-text-primary max-w-xl">
            Have a project in mind?
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-display text-accent-primary decoration-accent-primary/40 hover:text-accent-hover hover:decoration-accent-hover text-xl underline underline-offset-8 transition-colors md:text-2xl"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-10 pt-14 lg:grid-cols-5 lg:gap-8">
          <div className="col-span-2">
            <p className="font-display text-text-primary text-lg font-bold">
              VRTechBro
            </p>
            <p className="text-text-secondary mt-3 max-w-xs text-sm leading-relaxed">
              A founder-led studio building websites, mobile apps, Chrome
              extensions and APIs.
            </p>
            <div className="mt-6 flex gap-1" aria-label="Social media links">
              {socialItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className={`text-text-muted hover:bg-bg-tertiary rounded-lg p-2 transition-colors duration-200 ${item.hoverColor}`}
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-text-muted mb-4 text-sm font-medium">
                {col.title}
              </h2>
              <nav aria-label={col.label}>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-text-secondary hover:text-text-primary text-sm transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        <div className="border-border-subtle mt-14 flex flex-col justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} {COMPANY_LEGAL_NAME} All rights
            reserved.
          </p>
          <p className="text-text-muted text-xs">
            Built with Next.js and Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
