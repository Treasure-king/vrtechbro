import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | VRTechBro",
  description:
    "Read the Terms & Conditions of VRTechBro. Learn about your rights and obligations when using our IT services, software development, and digital solutions.",
  keywords: [
    "terms and conditions",
    "VRTechBro terms",
    "software development terms",
    "IT service agreement",
    "refund policy",
    "intellectual property",
    "governing law",
  ],
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms & Conditions | VRTechBro",
    description:
      "Read the Terms & Conditions of VRTechBro. Learn about your rights and obligations when using our IT services, software development, and digital solutions.",
    url: "https://vrtechbro.com/terms",
    siteName: "VRTechBro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | VRTechBro",
    description:
      "Read the Terms & Conditions of VRTechBro. Learn about your rights and obligations when using our IT services.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms & Conditions – VRTechBro",
  description:
    "Read the Terms & Conditions of VRTechBro. Learn about your rights and obligations when using our IT services.",
  url: "https://vrtechbro.com/terms",
};

export default function TermsAndConditions() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-text-primary">
        Terms & <span className="text-gradient">Conditions</span>
      </h1>
      <p className="mb-6 text-text-secondary leading-relaxed">
        Welcome to <strong className="text-text-primary">VRTechBro</strong>. By accessing or using our website and services, you
        agree to comply with and be bound by the following terms and conditions. Please read them
        carefully.
      </p>

      <section>
        <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">1. Use of Services</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          You agree to use our services only for lawful purposes. You must not misuse our website or
          attempt to disrupt its operation.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">2. Intellectual Property</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          All content, trademarks, logos, and designs on this site are the intellectual property of
          VRTechBro, unless otherwise stated. Unauthorized use, reproduction, or distribution is
          strictly prohibited.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">3. Third-Party Links</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          Our website may contain links to third-party websites. We are not responsible for the
          content, policies, or practices of these external sites.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">4. Limitation of Liability</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          VRTechBro is not liable for any damages resulting from your use of our website or services,
          including but not limited to loss of data, profits, or business opportunities.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">5. Payments & Refunds</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          Payments for our services must be made as agreed in project contracts. Refunds are subject
          to our review and will only be issued if mutually agreed upon.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">6. Termination</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          We reserve the right to suspend or terminate access to our services if these terms are
          violated.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">7. Governing Law</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to
          the jurisdiction of courts in Punjab, India.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">8. Changes to Terms</h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          VRTechBro may update these Terms & Conditions at any time. Updated versions will be posted
          on this page with the revised effective date.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">9. Contact Us</h2>
        <p className="text-text-secondary leading-relaxed">
          For any questions about these Terms & Conditions, please contact us at{" "}
          <a href="mailto:vrtechbro@gmail.com" className="text-accent-primary hover:text-accent-hover underline">
            vrtechbro@gmail.com
          </a>.
        </p>
      </section>
    </main>
    </>
  );
}
