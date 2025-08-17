const techTags = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js",
  "Node.js", "Express", "MongoDB", "Firebase", "Tailwind CSS"
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Technologies We Use",
  "itemListElement": techTags.map((tag, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": tag
  })),
};

export default function TechTags() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        aria-label="Technologies We Use"
        className="relative w-full overflow-hidden py-6 mt-10 text-white flex"
      >
        <nav aria-label="Technology tags carousel" className="flex w-full gap-6 px-4 overflow-hidden">
          <ul className="animate-scroll flex w-max gap-6 p-0 m-0 list-none">
            {techTags.map((tag, index) => (
              <li
                key={index}
                className="min-w-max px-6 py-3 bg-transparent border border-gray-300 rounded-xl shadow hover:text-pink-500 hover:bg-fuchsia-200 transition-colors duration-200 cursor-default"
              >
                {tag}
              </li>
            ))}
          </ul>

          {/* Repeat for seamless scroll */}
          <ul
            aria-hidden="true"
            className="animate-scroll flex w-max gap-6 p-0 m-0 list-none top-6 left-full"
          >
            {techTags.map((tag, index) => (
              <li
                key={`duplicate-${index}`}
                className="min-w-max px-6 py-3 bg-transparent border border-gray-300 rounded-xl shadow hover:text-pink-500 hover:bg-fuchsia-200 transition-colors duration-200 cursor-default"
              >
                {tag}
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </>
  );
}
