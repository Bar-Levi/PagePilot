import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/core/services/leadsService";
import { getTenantBySlug } from "@/core/services/tenantsService";

/**
 * Lead Submission API Route
 * POST /api/leads
 * 
 * Receives form submissions from public landing pages
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tenantSlug, landingPageId, contactInfo, meta, source } = body;

        // Validate required fields
        if (!tenantSlug) {
            return NextResponse.json(
                { error: "Tenant slug is required" },
                { status: 400 }
            );
        }

        if (!contactInfo?.email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Get tenant by slug
        const tenant = await getTenantBySlug(tenantSlug);
        if (!tenant) {
            return NextResponse.json(
                { error: "Tenant not found" },
                { status: 404 }
            );
        }

        // Create the lead
        const lead = await createLead({
            tenantId: tenant._id,
            landingPageId,
            contactInfo: {
                name: contactInfo.name,
                email: contactInfo.email,
                phone: contactInfo.phone,
            },
            meta: meta || {},
            source: source || request.headers.get("referer") || undefined,
        });

        // Optionally: Send to webhook if configured
        if (tenant.settings?.integrations?.sheetsWebhook) {
            try {
                await fetch(tenant.settings.integrations.sheetsWebhook, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: contactInfo.name,
                        email: contactInfo.email,
                        phone: contactInfo.phone,
                        ...meta,
                        createdAt: new Date().toISOString(),
                    }),
                });
            } catch (webhookError) {
                console.error("Webhook error:", webhookError);
                // Don't fail the request if webhook fails
            }
        }

        return NextResponse.json({
            success: true,
            leadId: lead._id,
        });
    } catch (error) {
        console.error("Lead submission error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
