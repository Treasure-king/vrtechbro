import { SiteChrome } from "@/components/layout/site-chrome";

/** Layout for every public page. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
