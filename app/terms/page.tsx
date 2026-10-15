import { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/legal-document";
import { CONTACT_EMAIL } from "@/lib/constants";

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

const sections: LegalSection[] = [
  {
    id: "use-of-services",
    title: "Use of services",
    content: (
      <p>
        You agree to use our services only for lawful purposes. You must not misuse our website or
        attempt to disrupt its operation.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    content: (
      <p>
        All content, trademarks, logos, and designs on this site are the intellectual property of
        VRTechBro, unless otherwise stated. Unauthorized use, reproduction, or distribution is
        strictly prohibited.
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-party links",
    content: (
      <p>
        Our website may contain links to third-party websites. We are not responsible for the
        content, policies, or practices of these external sites.
      </p>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of liability",
    content: (
      <p>
        VRTechBro is not liable for any damages resulting from your use of our website or services,
        including but not limited to loss of data, profits, or business opportunities.
      </p>
    ),
  },
  {
    id: "payments-and-refunds",
    title: "Payments and refunds",
    content: (
      <p>
        Payments for our services must be made as agreed in project contracts. Refunds are subject
        to our review and will only be issued if mutually agreed upon.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    content: (
      <p>
        We reserve the right to suspend or terminate access to our services if these terms are
        violated.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    content: (
      <p>
        These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to
        the jurisdiction of courts in Punjab, India.
      </p>
    ),
  },
  {
    id: "changes-to-terms",
    title: "Changes to terms",
    content: (
      <p>
        VRTechBro may update these Terms & Conditions at any time. Updated versions will be posted
        on this page with the revised effective date.
      </p>
    ),
  },
  {
    id: "contact-us",
    title: "Contact us",
    content: (
      <p>
        For any questions about these Terms & Conditions, please contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
];

export default function TermsAndConditions() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalDocument
        title="Terms and conditions"
        intro="Welcome to VRTechBro. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully."
        sections={sections}
      />
    </>
  );
}
