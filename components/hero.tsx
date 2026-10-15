"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import { Workbench } from "@/components/home/workbench";

/**
 * Home hero with three depth planes:
 *  back  — blueprint grid, drifts slowest
 *  mid   — light sources, drift and grow
 *  front — headline and workbench, which leave fastest; the workbench tilts toward the pointer
 * When the Gemini hero layers arrive, they slot into the back/mid planes.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const benchY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // Pointer tilt for the workbench (mouse only)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 18 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), spring);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const still = reduce ? { y: 0, opacity: 1, scale: 1 } : null;

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="border-border-subtle relative overflow-hidden border-b"
    >
      {/* Back plane */}
      <motion.div
        aria-hidden="true"
        style={still ?? { y: gridY }}
        className="bg-grid pointer-events-none absolute inset-0"
      />
      {/* Mid plane: light sources */}
      <motion.div
        aria-hidden="true"
        style={still ?? { y: glowY, scale: glowScale }}
        className="bg-accent-primary/15 pointer-events-none absolute top-1/4 right-[-10%] h-[520px] w-[720px] rounded-full blur-[120px]"
      />
      <motion.div
        aria-hidden="true"
        style={still ?? { y: glowY }}
        className="bg-signal/[0.07] pointer-events-none absolute bottom-[-20%] left-[-10%] h-[360px] w-[520px] rounded-full blur-[120px]"
      />

      {/* Front plane */}
      <div className="container-page relative grid grid-cols-1 items-center gap-14 pt-16 pb-20 md:pt-24 lg:grid-cols-12 lg:gap-12 lg:pb-28">
        <motion.div
          style={still ?? { y: copyY, opacity: copyOpacity }}
          className="min-w-0 lg:col-span-6 xl:col-span-5"
        >
          <SplitText
            as="h1"
            id="hero-title"
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
        </motion.div>

        <motion.div
          style={still ?? { y: benchY }}
          className="min-w-0 [perspective:1400px] lg:col-span-6 xl:col-span-7"
        >
          <motion.div
            style={reduce ? undefined : { rotateX, rotateY }}
            className="[transform-style:preserve-3d]"
          >
            <Workbench />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
