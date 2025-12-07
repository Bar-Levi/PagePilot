/**
 * App Portal Zone Layout
 * 
 * Layout for authenticated tenant portal (/app/*)
 * Includes auth checking and tenant context
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/core/services/authService";

export const metadata: Metadata = {
  title: {
    default: "פאנל ניהול | PagePilot",
    template: "%s | PagePilot",
  },
  robots: "noindex, nofollow", // Don't index admin pages
};

export default async function AppPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication (except for login page)
  // This will be handled per-page for flexibility

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {children}
    </div>
  );
}
