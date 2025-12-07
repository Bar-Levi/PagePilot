/**
 * Landing Public Zone Layout
 * 
 * Layout for public tenant landing pages (/l/[slug])
 * Minimal layout for performance - no navigation
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landing Page",
  robots: "index, follow",
};

export default function LandingPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
