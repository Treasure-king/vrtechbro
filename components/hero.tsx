import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import { Workbench } from "@/components/home/workbench";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="border-border-subtle relative overflow-hidden border-b"
    >
      <div
        className="bg-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      {/* Single light source behind the workbench */}
      <div
        aria-hidden="true"
        className="bg-accent-primary/15 pointer-events-none absolute top-1/3 right-[-10%] h-[520px] w-[720px] rounded-full blur-[120px]"
      />

      <div className="container-page relative grid grid-cols-1 items-center gap-14 pt-16 pb-20 md:pt-24 lg:grid-cols-12 lg:gap-12 lg:pb-28">
        <div className="min-w-0 lg:col-span-6 xl:col-span-5">
          <SplitText
            as="h1"
            text="We build the websites, apps and tools your business runs on."
            className="type-hero text-text-primary"
          />
          <p className="text-text-secondary mt-6 max-w-xl text-lg leading-relaxed">
            VRTechBro is a founder-led studio for websites, mobile apps, Chrome
            extensions and APIs. You work directly with the people who design
            and write the code.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Magnetic className="w-full sm:w-auto">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/contact">Start a project</Link>
              </Button>
            </Magnetic>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">See what we build</Link>
            </Button>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-6 xl:col-span-7">
          <Workbench />
        </div>
      </div>
    </section>
  );
}
