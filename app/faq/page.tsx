import { Metadata } from "next";

// ✅ SEO Metadata
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

// ✅ FAQ Page with improved UI
export default function FAQPage() {
  const faqs = [
    {
      q: "What is VRTechBro?",
      a: "VRTechBro is a modern platform offering tech tutorials, digital products, and innovative solutions for developers, creators, and businesses worldwide.",
    },
    {
      q: "How do I create an account?",
      a: "Simply click on the 'Sign Up' button at the top-right corner, enter your details, and confirm your email. Your account will be activated instantly.",
    },
    {
      q: "Is my personal data secure with VRTechBro?",
      a: "Yes. VRTechBro uses advanced encryption, GDPR-compliant practices, and end-to-end security to protect all user data and transactions.",
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
      q: "How can I reset my password?",
      a: "Go to the login page, click 'Forgot Password,' enter your registered email, and follow the instructions to reset securely.",
    },
    {
      q: "Where can I find tutorials or documentation?",
      a: "All learning resources, guides, and step-by-step tutorials are available under the 'Resources' section on our website.",
    },
    {
      q: "Does VRTechBro offer business or enterprise solutions?",
      a: "Yes, we provide tailored enterprise-level services, including integration, training, and support packages.",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* ✅ Page Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-sm">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Have questions about <span className="font-semibold">VRTechBro</span>? 
          We’ve got you covered. Browse through our most commonly asked questions below.
        </p>
      </header>

      {/* ✅ FAQ Section */}
      <section
        itemScope
        itemType="https://schema.org/FAQPage"
        className="space-y-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            className="rounded-xl border border-gray-700/40 bg-transparent shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <details className="group">
              <summary className="cursor-pointer px-6 py-4 flex justify-between items-center text-lg font-medium text-gray-200 hover:text-white transition-colors">
                <span>{faq.q}</span>
                <span className="ml-2 text-white font-bold group-open:rotate-45 transition-transform duration-300 text-2xl">
                  +
                </span>
              </summary>
              <div
                className="px-6 pb-5 text-white font-bold leading-relaxed border-t border-gray-700/50 bg-gray-800/50"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p itemProp="text">{faq.a}</p>
              </div>
            </details>
            <meta itemProp="name" content={faq.q} />
          </div>
        ))}
      </section>

      {/* ✅ Footer */}
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
