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
        a: "VRTechBro is a founder-led software studio. We design, build and maintain websites, web apps, mobile apps, Chrome extensions and APIs for businesses of any size.",
      },
      {
        q: "Where can I find services?",
        a: "Every service is listed on the Services page, with what is included and the tools we use. The home page also shows a selection under “Pick a service”.",
      },
      {
        q: "Does VRTechBro offer business or enterprise solutions?",
        a: "Yes. We take on larger projects too, including custom platforms, integrations with your existing systems, and search engine optimisation. Tell us about your requirements and we will propose a plan.",
      },
    ],
  },
  {
    topic: "Starting a project",
    items: [
      {
        q: "How do I reach out?",
        a: "Use the form on the Contact page, or open any service and send an enquiry from there. You can also email us directly. We reply by email with questions or a proposed next step.",
      },
    ],
  },
  {
    topic: "Payments and refunds",
    items: [
      {
        q: "What payment methods are supported?",
        a: "Payment terms and accepted methods are agreed in each project contract and listed on your invoice. Ask us if you need a particular method.",
      },
      {
        q: "Can I get a refund?",
        a: "Refunds are reviewed case by case and issued when both sides agree, as set out in our Terms and Conditions. If something isn't right, contact us and we will work through it with you.",
      },
    ],
  },
  {
    topic: "Privacy and support",
    items: [
      {
        q: "Is my personal data secure with VRTechBro?",
        a: "Yes. We only use your details to reply to you and to run your project, and we don't share them without your permission. Our Privacy Policy explains this in full.",
      },
      {
        q: "Do you offer customer support?",
        a: "Yes. Support is by email, Monday to Friday, 9:00 AM to 6:00 PM. Ongoing maintenance and support after launch can be included in your project agreement.",
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
