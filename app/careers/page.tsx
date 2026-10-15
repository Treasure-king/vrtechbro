import { Metadata } from 'next';
import CareersClient from '@/components/careers-client';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Careers at VRTechBro | Join Our Team',
  description:
    'Explore career opportunities at VRTechBro. Join our innovative IT consultancy team as a Frontend Developer, Backend Developer, or UI/UX Designer. Apply now!',
  keywords: [
    'VRTechBro careers',
    'IT jobs',
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Remote jobs',
    'India jobs',
    'Tech careers',
  ],
  alternates: {
    canonical: '/careers',
  },
  openGraph: {
    title: 'Careers at VRTechBro | Join Our Team',
    description:
      'Join VRTechBro\'s innovative team. Check out open positions in frontend, backend, and UI/UX design.',
    url: 'https://vrtechbro.com/careers',
    siteName: 'VRTechBro',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'VRTechBro Careers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at VRTechBro | Join Our Team',
    description:
      'Join VRTechBro\'s innovative team. Check out open positions in frontend, backend, and UI/UX design.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    location: 'Remote / India',
    type: 'Full-time',
    description:
      'We are looking for a skilled Frontend Developer with strong experience in React, Next.js, and TailwindCSS. You will work on scalable client projects and deliver beautiful UIs.',
  },
  {
    id: 2,
    title: 'Backend Developer',
    location: 'Remote / India',
    type: 'Full-time',
    description:
      'Seeking a Backend Developer experienced with Node.js, Express, and MongoDB. Knowledge of microservices and APIs is a big plus.',
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    location: 'Remote / Hybrid',
    type: 'Contract',
    description:
      'We are looking for creative UI/UX Designers who can turn requirements into intuitive interfaces. Familiarity with Figma and Tailwind design systems is preferred.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': jobs.map((job) => ({
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    employmentType: job.type === 'Full-time' ? 'FULL_TIME' : 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'VRTechBro',
      sameAs: 'https://vrtechbro.com',
      logo: 'https://vrtechbro.com/logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'India',
    },
    jobLocationType: 'TELECOMMUTE',
  })),
};

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title="Help us build things people rely on"
        intro="We're a small, founder-led studio. You'd work on real client projects from first sketch to launch, alongside the people who run the studio."
      >
        <Button asChild size="lg">
          <a href="#roles">See open roles</a>
        </Button>
      </PageHero>
      <CareersClient jobs={jobs} />
    </>
  );
}
