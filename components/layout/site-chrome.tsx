import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Curtain } from "@/components/layout/curtain";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

/**
 * Public site frame: navbar, main content and the curtain footer.
 * Used by app/(site)/layout.tsx and the global 404 page; the admin area has its own.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Curtain footer={<Footer />}>
        <Navbar />
        <main id="main" className="relative min-h-screen">
          {children}
        </main>
      </Curtain>
    </>
  );
}
