import { Metadata } from "next";
import CareersClient from "@/components/careers-client";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { JobRecord } from "@/types/supabase";

export const metadata: Metadata = {
  title: "Careers at VRTechBro | Join Our Team",
  description:
    "Explore career opportunities at VRTechBro. Join our innovative IT consultancy team as a Frontend Developer, Backend Developer, or UI/UX Designer. Apply now!",
  keywords: [
    "VRTechBro careers",
    "IT jobs",
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Remote jobs",
    "India jobs",
    "Tech careers",
  ],
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers at VRTechBro | Join Our Team",
    description:
      "Join VRTechBro's innovative team. Check out open positions in frontend, backend, and UI/UX design.",
    url: "https://vrtechbro.com/careers",
    siteName: "VRTechBro",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "VRTechBro Careers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at VRTechBro | Join Our Team",
    description:
      "Join VRTechBro's innovative team. Check out open positions in frontend, backend, and UI/UX design.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Shown when the jobs table is missing or empty, so the page never breaks.
// Fixed posting date for structured data (not today's date, which would change on every build).
const FALLBACK_DATE_POSTED = "2026-10-15";

type JobSource = Pick<
  JobRecord,
  "title" | "location" | "type" | "description"
> & {
  date_posted: string;
  valid_through?: string | null;
};

const FALLBACK_JOBS: JobSource[] = [
  {
    title: "Frontend Developer",
    location: "Remote / India",
    type: "Full-time",
    description:
      "We are looking for a skilled Frontend Developer with strong experience in React, Next.js, and TailwindCSS. You will work on scalable client projects and deliver beautiful UIs.",
  },
  {
    title: "Backend Developer",
    location: "Remote / India",
    type: "Full-time",
    description:
      "Seeking a Backend Developer experienced with Node.js, Express, and MongoDB. Knowledge of microservices and APIs is a big plus.",
  },
  {
    title: "UI/UX Designer",
    location: "Remote / Hybrid",
    type: "Contract",
    description:
      "We are looking for creative UI/UX Designers who can turn requirements into intuitive interfaces. Familiarity with Figma and Tailwind design systems is preferred.",
  },
].map((job) => ({ ...job, date_posted: FALLBACK_DATE_POSTED }));

export const revalidate = 3600;

async function getOpenJobs(): Promise<JobSource[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("title, location, type, description, date_posted, valid_through")
    .eq("is_open", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error(
      "Careers: could not load jobs from Supabase, using fallback list:",
      error.message,
    );
    return FALLBACK_JOBS;
  }
  // An empty result means every role is closed, so show the empty state rather than old roles
  return (data ?? []) as JobSource[];
}

function buildJsonLd(jobs: JobSource[]) {
  return {
    "@context": "https://schema.org",
    "@graph": jobs.map((job) => ({
      "@type": "JobPosting",
      title: job.title,
      description: job.description,
      datePosted: job.date_posted,
      ...(job.valid_through ? { validThrough: job.valid_through } : {}),
      employmentType: job.type === "Full-time" ? "FULL_TIME" : "CONTRACTOR",
      hiringOrganization: {
        "@type": "Organization",
        name: "VRTechBro",
        sameAs: "https://vrtechbro.com",
        logo: "https://vrtechbro.com/logo.png",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
      },
      applicantLocationRequirements: {
        "@type": "Country",
        name: "India",
      },
      jobLocationType: "TELECOMMUTE",
    })),
  };
}

export default async function CareersPage() {
  const openJobs = await getOpenJobs();
  const jsonLd = buildJsonLd(openJobs);
  // The client components expect a numeric id; position in the list is enough.
  const jobs = openJobs.map((job, i) => ({
    id: i + 1,
    title: job.title,
    location: job.location,
    type: job.type,
    description: job.description,
  }));

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
