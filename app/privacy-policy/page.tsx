import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | VRTechBro",
  description:
    "Read VRTechBro's Privacy Policy to understand how we collect, use, and protect your personal data when you interact with our services.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | VRTechBro",
    description:
      "Learn about VRTechBro’s commitment to your privacy, how we collect and use data, and your rights as a user.",
    url: "https://vrtechbro.com/privacy-policy",
    siteName: "VRTechBro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | VRTechBro",
    description:
      "Learn about VRTechBro’s commitment to your privacy, how we collect and use data, and your rights as a user.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy – VRTechBro",
  description:
    "Read VRTechBro's Privacy Policy to understand how we collect, use, and protect your personal data.",
  url: "https://vrtechbro.com/privacy-policy",
};

export default function PrivacyPolicy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        className="max-w-3xl mx-auto px-6 py-24"
        role="main"
        aria-labelledby="privacy-policy-title"
      >
      <h1 id="privacy-policy-title" className="text-3xl sm:text-4xl font-display font-bold mb-8 text-text-primary">
        Privacy <span className="text-gradient">Policy</span>
      </h1>
      <p className="mb-6 text-text-secondary leading-relaxed">
        At <strong className="text-text-primary">VRTechBro</strong>, we respect your privacy and are committed to protecting
        your personal information. This Privacy Policy explains how we collect, use, and safeguard
        your data when you interact with our website and services.
      </p>

      <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">1. Information We Collect</h2>
      <p className="mb-4 text-text-secondary leading-relaxed">
        We may collect personal information such as your name, email address, phone number, and
        billing details when you contact us, request a quote, or use our services. We also collect
        non-personal information such as browser type, IP address, and usage statistics for
        analytics and security.
      </p>

      <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2 text-text-secondary leading-relaxed">
        <li>To provide and improve our services</li>
        <li>To respond to your inquiries and support requests</li>
        <li>To send service updates, promotional offers, and company news (with your consent)</li>
        <li>To ensure website security and prevent fraud</li>
      </ul>

      <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">3. Sharing of Information</h2>
      <p className="mb-4 text-text-secondary leading-relaxed">
        We do not sell or rent your personal data. Information may be shared only with trusted
        third-party service providers (e.g., hosting, analytics, payment processing) under strict
        confidentiality agreements.
      </p>

      <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">4. Data Security</h2>
      <p className="mb-4 text-text-secondary leading-relaxed">
        We implement industry-standard measures to protect your information. However, please note
        that no method of transmission over the internet is 100% secure.
      </p>

      <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">5. Your Rights</h2>
      <p className="mb-4 text-text-secondary leading-relaxed">
        You have the right to access, update, or request deletion of your personal information. You
        may also opt out of marketing communications at any time.
      </p>

      <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">6. Changes to This Policy</h2>
      <p className="mb-4 text-text-secondary leading-relaxed">
        We may update this Privacy Policy from time to time. The latest version will always be
        available on this page with the effective date.
      </p>

      <h2 className="text-2xl font-display font-semibold mt-10 mb-4 text-text-primary">7. Contact Us</h2>
      <p className="text-text-secondary leading-relaxed">
        If you have any questions regarding this Privacy Policy, please contact us at{" "}
        <a
          href="mailto:vrtechbro@gmail.com"
          className="text-accent-primary hover:text-accent-hover underline"
          aria-label="Email VRTechBro support"
        >
          vrtechbro@gmail.com
        </a>
        .
      </p>
    </main>
    </>
  );
}
