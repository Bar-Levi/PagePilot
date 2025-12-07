import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/core/services/authService";
import { publishLandingPage, getLandingPageById } from "@/core/services/landingPagesService";
import { getTenantById } from "@/core/services/tenantsService";

/**
 * Publish Landing Page API Route
 * POST /api/landing-pages/[id]/publish
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Publish the page
        const page = await publishLandingPage(id, session.tenantId);
        if (!page) {
            return NextResponse.json(
                { error: "Landing page not found" },
                { status: 404 }
            );
        }

        // Get tenant for the slug
        const tenant = await getTenantById(session.tenantId);
        if (tenant) {
            // Revalidate the public landing page
            revalidatePath(`/l/${tenant.slug}`);
        }

        return NextResponse.json({
            success: true,
            page: {
                id: page._id,
                status: page.status,
                publishedAt: page.publishedAt,
            },
        });
    } catch (error) {
        console.error("Publish error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
