import { Metadata } from "next";
import {
  LegalDocument,
  type LegalSection,
} from "@/components/legal/legal-document";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | VRTechBro",
  description:
    "Read VRTechBro's Privacy Policy to understand how we collect, use, and protect your personal data when you interact with our services.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "VRTechBro",
      },
    ],
    title: "Privacy Policy | VRTechBro",
    description:
      "Learn about VRTechBro’s commitment to your privacy, how we collect and use data, and your rights as a user.",
    url: "https://vrtechbro.com/privacy-policy",
    siteName: "VRTechBro",
    type: "website",
  },
  twitter: {
    images: ["/opengraph-image.jpg"],
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

const sections: LegalSection[] = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: (
      <p>
        We may collect personal information such as your name, email address,
        phone number, and billing details when you contact us, request a quote,
        or use our services. We also collect non-personal information such as
        browser type, IP address, and usage statistics for analytics and
        security.
      </p>
    ),
  },
  {
    id: "how-we-use-your-information",
    title: "How we use your information",
    content: (
      <ul>
        <li>To provide and improve our services</li>
        <li>To respond to your inquiries and support requests</li>
        <li>
          To send service updates, promotional offers, and company news (with
          your consent)
        </li>
        <li>To ensure website security and prevent fraud</li>
      </ul>
    ),
  },
  {
    id: "sharing-of-information",
    title: "Sharing of information",
    content: (
      <p>
        We do not sell or rent your personal data. Information may be shared
        only with trusted third-party service providers (e.g., hosting,
        analytics, payment processing) under strict confidentiality agreements.
      </p>
    ),
  },
  {
    id: "data-security",
    title: "Data security",
    content: (
      <p>
        We implement industry-standard measures to protect your information.
        However, please note that no method of transmission over the internet is
        100% secure.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <p>
        You have the right to access, update, or request deletion of your
        personal information. You may also opt out of marketing communications
        at any time.
      </p>
    ),
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. The latest version
        will always be available on this page with the effective date.
      </p>
    ),
  },
  {
    id: "contact-us",
    title: "Contact us",
    content: (
      <p>
        If you have any questions regarding this Privacy Policy, please contact
        us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalDocument
        title="Privacy policy"
        intro="At VRTechBro, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you interact with our website and services."
        sections={sections}
        updated="2026-10-17"
      />
    </>
  );
}
