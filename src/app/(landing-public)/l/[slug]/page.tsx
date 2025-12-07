import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedLandingPageBySlug } from "@/core/services/landingPagesService";
import { ComponentRenderer } from "@/components/landing-page/component-renderer";
import type { PageComponent } from "@/components/landing-page/types";

/**
 * Public Landing Page
 * 
 * Renders the published landing page for a tenant based on their slug.
 * Route: /l/[slug]
 */

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedLandingPageBySlug(slug);

  if (!result) {
    return {
      title: "Page Not Found",
    };
  }

  const { page, tenant } = result;

  return {
    title: page.seoTitle || page.title || tenant.name,
    description: page.seoDescription || `${tenant.name} - Landing Page`,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription,
      type: "website",
    },
  };
}

// Enable ISR with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function PublicLandingPage({ params }: Props) {
  const { slug } = await params;
  const result = await getPublishedLandingPageBySlug(slug);

  if (!result) {
    notFound();
  }

  const { page, tenant } = result;

  // Use publishedConfig if available (snapshot at publish time), otherwise config
  const pageConfig = (page.publishedConfig || page.config) as PageComponent;

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Render each child component */}
      {pageConfig.children?.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          isEditing={false}
        />
      ))}

      {/* Optional: Add tenant integrations (GA, Clarity) */}
      {tenant.settings?.integrations?.googleAnalytics && (
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${tenant.settings.integrations.googleAnalytics}`}
        />
      )}
    </div>
  );
}
