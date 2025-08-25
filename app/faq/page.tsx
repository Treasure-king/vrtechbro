import { Metadata } from "next";

// SEO Metadata — clean, descriptive, and rich for sharing & crawling
export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | VRTechBro",
  description:
    "Find answers to the most frequently asked questions about VRTechBro. Explore our services, pricing, support, and policies in one place.",
  keywords: [
    "VRTechBro FAQ",
    "Frequently Asked Questions",
    "VRTechBro Support",
    "Tech Solutions Help",
    "VRTechBro Policies",
    "VRTechBro Contact",
  ],
  openGraph: {
    title: "VRTechBro FAQ - Get All Your Answers",
    description:
      "Looking for quick answers? Explore VRTechBro's FAQ page with detailed information on services, policies, and support.",
    url: "https://www.vrtechbro.com/faq",
    siteName: "VRTechBro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vrtechbro",
    title: "VRTechBro FAQ - Find Your Answers",
    description:
      "Explore VRTechBro's FAQ page with helpful answers to common questions about our services, policies, and support.",
  },
  alternates: {
    canonical: "https://www.vrtechbro.com/faq",
  },
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What is VRTechBro?",
      a: "VRTechBro is a modern platform offering tech services, digital products, and innovative solutions for clients, creators, and businesses worldwide.",
    },
    {
      q: "How do I reach out?",
      a: "Simply go to the service section, click any service you want, then click on the Get Service button. Fill the details in the form and you will be contacted shortly.",
    },
    {
      q: "Is my personal data secure with VRTechBro?",
      a: "Yes. VRTechBro doesn't share your personal data with anyone without your permission; all your data is only used to contact you regarding the project.",
    },
    {
      q: "What payment methods are supported?",
      a: "We accept all major credit/debit cards, PayPal, UPI, and international payment gateways for global users.",
    },
    {
      q: "Can I get a refund?",
      a: "Yes. Refunds are available under our Refund Policy within 14 days of purchase if conditions are met.",
    },
    {
      q: "Do you offer customer support?",
      a: "Absolutely. We provide 24/7 customer support through email, live chat, and a dedicated help center.",
    },
    {
      q: "Where can I find services?",
      a: "All the services are listed on the service page. You can also click on the Explore button on the home page under the services section on our website.",
    },
    {
      q: "Does VRTechBro offer business or enterprise solutions?",
      a: "Yes, we provide tailored enterprise-level services, including development, integration, and Search Engine Optimization (SEO).",
    },
  ];

  return (
    <main
      className="max-w-7xl mx-auto px-6 py-16"
      role="main"
      aria-labelledby="faq-heading"
    >
      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1
          id="faq-heading"
          className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-sm"
        >
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Have questions about <span className="font-semibold">VRTechBro</span>?{" "}
          We’ve got you covered. Browse through our most commonly asked questions below.
        </p>
      </header>

      {/* FAQ Section with FAQPage schema */}
      <section
        itemScope
        itemType="https://schema.org/FAQPage"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        aria-label="Frequently Asked Questions"
      >
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            className="rounded-xl border border-gray-700/40 bg-transparent shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <details className="group" aria-expanded="false">
              <summary
                className="cursor-pointer px-6 py-4 flex justify-between items-center text-lg font-medium text-gray-200 hover:text-white transition-colors"
                aria-controls={`faq-answer-${idx}`}
                id={`faq-question-${idx}`}
              >
                <span>{faq.q}</span>
                <span className="ml-2 text-white font-bold group-open:rotate-45 transition-transform duration-300 text-2xl">
                  +
                </span>
              </summary>
              <div
                id={`faq-answer-${idx}`}
                className="px-6 py-5 text-white font-bold leading-relaxed border-t border-gray-700/50 bg-gray-800/50"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
                aria-labelledby={`faq-question-${idx}`}
              >
                <p itemProp="text">{faq.a}</p>
              </div>
            </details>
            <meta itemProp="name" content={faq.q} />
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-14 text-center text-sm text-gray-500">
        Still have questions?{" "}
        <a
          href="/contact"
          className="text-blue-500 hover:underline font-medium"
          aria-label="Contact VRTechBro Support"
        >
          Contact our support team
        </a>
        .
      </footer>
    </main>
  );
}
