import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | VRTechBro",
  robots: { index: false, follow: false, nocache: true },
};

/** Everything under /admin is private: no indexing, always rendered per request. */
export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-bg-primary min-h-screen">{children}</div>;
}
