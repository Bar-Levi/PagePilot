import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { registerTenant, getAuthCookieOptions } from "@/core/services/authService";

/**
 * Register API Route
 * POST /api/auth/register
 * 
 * Creates a new tenant + owner user
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tenantSlug, tenantName, ownerEmail, ownerPassword, ownerName } = body;

        // Validate required fields
        if (!tenantSlug || !tenantName || !ownerEmail || !ownerPassword) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Register tenant and owner
        const result = await registerTenant({
            tenantSlug,
            tenantName,
            ownerEmail,
            ownerPassword,
            ownerName,
        });

        if (!result) {
            return NextResponse.json(
                { error: "Registration failed" },
                { status: 500 }
            );
        }

        // Set auth cookie
        const cookieStore = await cookies();
        const cookieOptions = getAuthCookieOptions();
        cookieStore.set(cookieOptions.name, result.token, {
            httpOnly: cookieOptions.httpOnly,
            secure: cookieOptions.secure,
            sameSite: cookieOptions.sameSite,
            path: cookieOptions.path,
            maxAge: cookieOptions.maxAge,
        });

        // Return success with tenant info
        return NextResponse.json({
            success: true,
            tenant: {
                id: result.tenant._id,
                slug: result.tenant.slug,
                name: result.tenant.name,
            },
            user: {
                id: result.user._id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role,
            },
            publicUrl: `/l/${result.tenant.slug}`,
            dashboardUrl: `/app/dashboard`,
        });
    } catch (error: any) {
        console.error("Registration error:", error);

        // Handle specific errors
        if (error.message?.includes("Slug already taken")) {
            return NextResponse.json(
                { error: "שם העסק כבר תפוס. בחר שם אחר." },
                { status: 400 }
            );
        }

        if (error.message?.includes("Email already registered")) {
            return NextResponse.json(
                { error: "האימייל כבר רשום במערכת." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "שגיאה ביצירת החשבון" },
            { status: 500 }
        );
    }
}
