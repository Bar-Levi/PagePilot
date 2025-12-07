/**
 * Marketing Zone Layout
 * 
 * Layout for PagePilot marketing pages (/, /pricing, /contact)
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "PagePilot - בנה דפי נחיתה מדהימים עם AI",
    template: "%s | PagePilot",
  },
  description:
    "PagePilot משתמש ב-AI מתקדם ליצירת דפי נחיתה מקצועיים תוך דקות. בלי קוד, בלי מאמץ, רק תוצאות מדהימות.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
