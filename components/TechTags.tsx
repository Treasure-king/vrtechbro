'use client';

import React from 'react';

// 🛠️ Technologies you want to showcase
const techTags = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js',
  'Node.js', 'Express', 'MongoDB', 'Firebase', 'Tailwind CSS',
];

// ✅ SEO-optimized JSON-LD structured data with extra schema fields
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Technologies We Use at VRTechBro",
  "description": "A list of front-end and back-end technologies used by VRTechBro in building scalable web, mobile, and cloud-based applications.",
  "numberOfItems": techTags.length,
  "itemListOrder": "https://schema.org/ItemListOrderAscending",
  "itemListElement": techTags.map((tag, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": tag
  })),
};

export default function TechTags() {
  return (
    <>
      {/* 🚀 JSON-LD for Technologies Used */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        id="technologies"
        aria-labelledby="tech-tags-title"
        className="relative w-full overflow-hidden py-6 mt-10 text-white flex flex-col items-center"
      >
        <h2 id="tech-tags-title" className="sr-only">
          Technologies We Use at VRTechBro
        </h2>

        {/* 🔁 Infinite carousel-style scrolling tags */}
        <nav
          aria-label="Technology tags carousel"
          className="flex w-full gap-6 px-4 overflow-hidden"
        >
          {/* 🟡 Visible tag list */}
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

          {/* 🟠 Visually hidden duplicate for seamless loop */}
          <ul
            aria-hidden="true"
            className="animate-scroll flex w-max gap-6 p-0 m-0 list-none"
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

        {/* ✅ Optional visible caption for SEO (optional) */}
        <p className="mt-6 text-sm text-center text-gray-200 max-w-2xl">
          These are the modern technologies we use to craft secure, scalable, and performant applications at VRTechBro.
        </p>
      </section>
    </>
  );
}
