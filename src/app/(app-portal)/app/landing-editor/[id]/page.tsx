import { redirect } from "next/navigation";
import { getSession } from "@/core/services/authService";
import { getLandingPageById } from "@/core/services/landingPagesService";
import { getTenantById } from "@/core/services/tenantsService";
import { EditorWrapper } from "@/components/editor/editor-wrapper";

/**
 * Landing Page Editor
 * 
 * Loads existing page from DB and renders editor
 * Route: /app/landing-editor/[id] where id is the landing page ID
 */

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LandingEditorPage({ params }: Props) {
  const session = await getSession();

  if (!session) {
    redirect("/app/login");
  }

  const { id } = await params;
  const tenant = await getTenantById(session.tenantId);

  if (!tenant) {
    redirect("/app/login");
  }

  // Load existing page
  const pageData = await getLandingPageById(id, session.tenantId);
  
  if (!pageData) {
    // Page not found or doesn't belong to this tenant
    console.log("❌ Page not found or access denied:", id);
    redirect("/app/dashboard");
  }

  console.log("✅ Loading page into editor:", {
    pageId: pageData._id,
    title: pageData.title,
    hasConfig: !!pageData.config,
  });

  return (
    <div className="min-h-screen">
      <EditorWrapper 
        initialConfig={pageData.config}
        landingPageId={id}
        tenantId={session.tenantId}
      />
    </div>
  );
}
