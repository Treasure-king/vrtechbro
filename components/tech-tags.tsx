import { TECH_TAGS } from "@/lib/constants";
import { Marquee } from "@/components/motion/marquee";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Technologies We Use at VRTechBro",
  description:
    "A list of front-end and back-end technologies used by VRTechBro in building scalable web, mobile, and cloud-based applications.",
  numberOfItems: TECH_TAGS.length,
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  itemListElement: TECH_TAGS.map((tag, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tag,
  })),
};

export default function TechTags() {
  return (
    <section
      id="technologies"
      aria-labelledby="tech-tags-title"
      className="border-border-subtle border-b py-8"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-page flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
        <h2 id="tech-tags-title" className="text-text-muted shrink-0 text-sm">
          Our everyday stack
        </h2>
        <Marquee
          items={TECH_TAGS}
          className="font-display text-text-secondary [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] text-lg"
        />
      </div>
    </section>
  );
}
