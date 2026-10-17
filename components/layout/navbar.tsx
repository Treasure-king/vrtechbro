"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** A section link stays active on its child pages (e.g. /blog on /blog/some-post). */
function isActiveLink(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Site navigation. Motion is plain CSS (no animation library), because this
 * component ships on every page and should stay as light as possible.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation (adjusting state during render, as React recommends)
  const [menuPath, setMenuPath] = useState(pathname);
  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setMobileOpen(false);
  }

  // While the mobile menu is open: lock page scroll, close on Escape,
  // move focus into the menu and return it to the toggle afterwards.
  useEffect(() => {
    if (!mobileOpen) return;
    const toggle = toggleRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      // Keep Tab inside the open menu: its links plus the close toggle
      const menu = document.getElementById("mobile-menu");
      const focusables = [
        toggle,
        ...Array.from(
          menu?.querySelectorAll<HTMLElement>("a[href], button") ?? [],
        ),
      ].filter((el): el is HTMLElement => Boolean(el));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (
        e.shiftKey &&
        (active === first || !focusables.includes(active as HTMLElement))
      ) {
        e.preventDefault();
        last.focus();
      } else if (
        !e.shiftKey &&
        (active === last || !focusables.includes(active as HTMLElement))
      ) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,padding,box-shadow] duration-300",
        scrolled
          ? "glass py-2 shadow-lg shadow-black/20"
          : "bg-bg-primary/80 py-3 backdrop-blur-md",
      )}
    >
      <a
        href="#main"
        className="bg-accent-primary text-on-accent sr-only rounded-lg px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[60]"
      >
        Skip to content
      </a>

      <div className="via-accent-primary/40 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="container-page flex items-center justify-between">
        <Link href="/" aria-label="VRTechBro home" className="group">
          <Logo
            size={scrolled ? 60 : 72}
            priority
            className="transition-all duration-300 group-hover:drop-shadow-[0_0_12px_var(--brand-signal)]"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = isActiveLink(pathname, link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-accent-primary"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                {link.name}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -bottom-1.5 left-0 h-0.5 w-full origin-center rounded-full transition-transform duration-300 ease-out",
                    isActive
                      ? "bg-accent-primary scale-x-100"
                      : "bg-accent-primary/60 scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}

          <Button asChild size="sm">
            <Link href="/contact">Start a project</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="text-text-primary hover:bg-bg-tertiary focus-visible:ring-accent-primary/50 relative z-50 rounded-lg p-2 transition-colors focus:outline-none focus-visible:ring-2 md:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu: full-screen overlay */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="menu-fade fixed inset-0 z-40 md:hidden"
        >
          <div className="bg-bg-primary/95 absolute inset-0 backdrop-blur-xl" />
          <nav
            aria-label="Mobile primary navigation"
            className="relative flex h-full flex-col items-center justify-center gap-6"
          >
            {NAV_LINKS.map((link, i) => {
              const isActive = isActiveLink(pathname, link.href);
              return (
                <Link
                  key={link.name}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rise font-display block text-2xl font-semibold tracking-tight transition-colors duration-200",
                    isActive
                      ? "text-accent-primary"
                      : "text-text-secondary hover:text-text-primary",
                  )}
                  style={
                    { "--rise-delay": `${i * 0.04}s` } as React.CSSProperties
                  }
                >
                  {link.name}
                </Link>
              );
            })}
            <Button
              asChild
              size="lg"
              className="rise"
              style={
                {
                  "--rise-delay": `${NAV_LINKS.length * 0.04}s`,
                } as React.CSSProperties
              }
            >
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                Start a project
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
