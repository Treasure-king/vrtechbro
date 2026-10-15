import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Workbench } from "@/components/home/workbench";

/**
 * Home hero. Deliberately still: the workbench typing out its first snippet is
 * the page's one load-time moment, so nothing else here moves.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="border-border-subtle relative overflow-hidden border-b"
    >
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="bg-accent-primary/12 pointer-events-none absolute top-1/4 right-[-10%] h-[480px] w-[680px] rounded-full blur-[120px]"
      />

      <div className="container-page relative grid grid-cols-1 items-center gap-12 pt-16 pb-20 md:pt-24 lg:grid-cols-12 lg:gap-14 lg:pb-28">
        <div className="min-w-0 lg:col-span-5">
          <h1 id="hero-title" className="type-hero text-text-primary">
            We build the websites, apps and tools your business runs on.
          </h1>
          <p className="text-text-secondary mt-6 max-w-lg text-lg leading-relaxed">
            VRTechBro is a founder-led studio for websites, mobile apps, Chrome
            extensions and APIs. You work directly with the people who design
            and write the code.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/contact">Start a project</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">See what we build</Link>
            </Button>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <Workbench />
        </div>
      </div>
    </section>
  );
}
