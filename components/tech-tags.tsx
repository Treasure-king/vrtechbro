import React from 'react';
import { TECH_TAGS } from '@/lib/constants';

const techTags = TECH_TAGS;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Technologies We Use at VRTechBro',
  description:
    'A list of front-end and back-end technologies used by VRTechBro in building scalable web, mobile, and cloud-based applications.',
  numberOfItems: techTags.length,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: techTags.map((tag, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: tag,
  })),
};

export default function TechTags() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        id="technologies"
        aria-labelledby="tech-tags-title"
        className="relative w-full overflow-hidden py-12 flex flex-col items-center"
      >
        <h2 id="tech-tags-title" className="sr-only">
          Technologies We Use at VRTechBro
        </h2>

        {/* Seamless scrolling tags */}
        <nav
          aria-label="Technology tags carousel"
          className="flex w-full gap-6 px-4 overflow-hidden"
        >
          <ul className="animate-scroll flex w-max gap-4 p-0 m-0 list-none">
            {techTags.map((tag, index) => (
              <li
                key={index}
                className="min-w-max px-5 py-2.5 bg-bg-secondary border border-border-subtle rounded-xl text-sm text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 hover:bg-accent-primary/5 transition-all duration-200 cursor-default"
              >
                {tag}
              </li>
            ))}
          </ul>

          <ul
            aria-hidden="true"
            className="animate-scroll flex w-max gap-4 p-0 m-0 list-none"
          >
            {techTags.map((tag, index) => (
              <li
                key={`duplicate-${index}`}
                className="min-w-max px-5 py-2.5 bg-bg-secondary border border-border-subtle rounded-xl text-sm text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 hover:bg-accent-primary/5 transition-all duration-200 cursor-default"
              >
                {tag}
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-6 text-sm text-center text-text-muted max-w-2xl px-4">
          These are the modern technologies we use to craft secure, scalable, and
          performant applications at VRTechBro.
        </p>
      </section>
    </>
  );
}
