import { redirect } from "next/navigation";
import { getSession } from "@/core/services/authService";
import { BusinessInputForm } from "@/components/editor/business-input-form";

/**
 * Create New Landing Page
 * Route: /app/create-page
 */

export default async function CreatePagePage() {
  const session = await getSession();

  if (!session) {
    redirect("/app/login");
  }

  return <BusinessInputForm />;
}
