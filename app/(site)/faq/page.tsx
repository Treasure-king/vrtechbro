import Link from "next/link";
import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { FaqGroups, type FaqGroup } from "@/components/faq/faq-groups";

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
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "VRTechBro",
      },
    ],
    title: "VRTechBro FAQ - Get All Your Answers",
    description:
      "Looking for quick answers? Explore VRTechBro's FAQ page with detailed information on services, policies, and support.",
    url: "https://vrtechbro.com/faq",
    siteName: "VRTechBro",
    type: "website",
  },
  twitter: {
    images: ["/opengraph-image.jpg"],
    card: "summary_large_image",
    site: "@vrtechbro",
    title: "VRTechBro FAQ - Find Your Answers",
    description:
      "Explore VRTechBro's FAQ page with helpful answers to common questions about our services, policies, and support.",
  },
  alternates: {
    canonical: "/faq",
  },
};

// Existing answers, grouped by topic
const FAQ_GROUPS: FaqGroup[] = [
  {
    topic: "About VRTechBro",
    items: [
      {
        q: "What is VRTechBro?",
        a: "VRTechBro is a modern platform offering tech services, digital products, and innovative solutions for clients, creators, and businesses worldwide.",
      },
      {
        q: "Where can I find services?",
        a: "All the services are listed on the service page. You can also click on the Explore button on the home page under the services section on our website.",
      },
      {
        q: "Does VRTechBro offer business or enterprise solutions?",
        a: "Yes, we provide tailored enterprise-level services, including development, integration, and Search Engine Optimization (SEO).",
      },
    ],
  },
  {
    topic: "Starting a project",
    items: [
      {
        q: "How do I reach out?",
        a: "Simply go to the service section, click any service you want, then click on the Get Service button. Fill the details in the form and you will be contacted shortly.",
      },
    ],
  },
  {
    topic: "Payments and refunds",
    items: [
      {
        q: "What payment methods are supported?",
        a: "We accept all major credit/debit cards, PayPal, UPI, and international payment gateways for global users.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes. Refunds are available under our Refund Policy within 14 days of purchase if conditions are met.",
      },
    ],
  },
  {
    topic: "Privacy and support",
    items: [
      {
        q: "Is my personal data secure with VRTechBro?",
        a: "Yes. VRTechBro doesn't share your personal data with anyone without your permission; all your data is only used to contact you regarding the project.",
      },
      {
        q: "Do you offer customer support?",
        a: "Absolutely. We provide 24/7 customer support through email, live chat, and a dedicated help center.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  ),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        title="Frequently asked questions"
        intro="Answers about how we work, payments, privacy and support. If something isn't covered here, ask us directly."
      />

      <section aria-label="Questions and answers" className="py-16 md:py-24">
        <div className="container-page">
          <FaqGroups groups={FAQ_GROUPS} />
        </div>
      </section>

      <section
        aria-labelledby="faq-contact-title"
        className="border-border-subtle border-t py-16 md:py-20"
      >
        <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2
              id="faq-contact-title"
              className="font-display text-text-primary text-2xl font-semibold tracking-tight"
            >
              Didn&apos;t find your answer?
            </h2>
            <p className="text-text-secondary mt-2">
              Send us your question and we&apos;ll reply by email.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/contact">Ask a question</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
