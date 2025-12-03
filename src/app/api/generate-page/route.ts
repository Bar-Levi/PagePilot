import { NextRequest, NextResponse } from "next/server";
import { processAndIndexFiles } from "@/ai/rag";
import type { BusinessInput } from "@/ai/types";
import { generateLandingPageFlow } from "@/ai/orchestrator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Convert from old format to new BusinessInput format
    // Support both old and new formats for backward compatibility
    const businessName = body.businessName ||
      (body.businessDescription ? body.businessDescription.split(" ").slice(0, 3).join(" ") : null) ||
      "עסק";

    const businessInput: BusinessInput = {
      businessName,
      businessType: body.businessType || body.businessDescription || "עסק כללי",
      audience: body.audience || body.targetAudience || "",
      mainGoal: (body.mainGoal as BusinessInput["mainGoal"]) || "leads",
      tone: (body.tone as BusinessInput["tone"]) || "professional",
      pains: body.pains || [],
      benefits: body.benefits || [],
      proofPoints: body.proofPoints,
      specialOffer: body.specialOffer,
      docsRefId: body.docsRefId || businessName,
    };

    // If files are provided, index them
    // Note: In a real implementation, files would come as FormData
    // For now, we'll handle text context
    if (body.businessContext) {
      const businessKey = businessInput.docsRefId || businessInput.businessName;
      await processAndIndexFiles(businessKey, body.businessContext, []);
    }

    // Run the flow
    const result = await generateLandingPageFlow(businessInput);

    // Log the final result for debugging
    console.log("✅ Final result - Page has", result.page.children?.length || 0, "sections");
    console.log("📊 Page structure:", JSON.stringify(result.page, null, 2));

    return NextResponse.json({
      page: result.page,
      analytics: result.analytics,
    });
  } catch (error: any) {
    console.error("Error generating landing page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate landing page" },
      { status: 500 }
    );
  }
}

