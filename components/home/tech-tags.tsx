import { TECH_TAGS } from "@/lib/constants";

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
      <div className="container-page flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10">
        <h2 id="tech-tags-title" className="text-text-muted shrink-0 text-sm">
          Our everyday stack
        </h2>
        <ul className="text-text-secondary flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {TECH_TAGS.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
