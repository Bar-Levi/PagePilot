import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateOTP } from "@/core/services/usersService";
import { getTenantById } from "@/core/services/tenantsService";
import { getAuthCookieOptions } from "@/core/services/authService";

/**
 * Login with OTP API Route
 * POST /api/auth/login-otp
 */
export async function POST(request: NextRequest) {
    console.log("\n🔐 === OTP LOGIN ATTEMPT ===");
    try {
        const body = await request.json();
        const { email, otp } = body;

        console.log("📥 Login attempt:", { email, otp });

        if (!email || !otp) {
            console.log("❌ Missing email or OTP");
            return NextResponse.json(
                { error: "Email and OTP are required" },
                { status: 400 }
            );
        }

        console.log("🔍 Validating OTP...");
        const user = await validateOTP(email, otp);

        if (!user) {
            console.log("❌ OTP validation failed - invalid or expired");
            return NextResponse.json(
                { error: "קוד שגוי או פג תוקף" },
                { status: 401 }
            );
        }

        console.log("✅ OTP validated for user:", user._id);
        // Get tenant
        const tenant = await getTenantById(user.tenantId);
        if (!tenant) {
            return NextResponse.json(
                { error: "Tenant not found" },
                { status: 404 }
            );
        }

        // Create session using authService
        const { createSession } = await import("@/core/services/authService");
        await createSession(user, tenant._id.toString());

        console.log("✅ Auth cookie set successfully");

        // Check if user needs to set password
        const needsPassword = !user.hasSetPassword;

        return NextResponse.json({
            success: true,
            needsPassword,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            tenant: {
                id: tenant._id,
                slug: tenant.slug,
                name: tenant.name,
            },
        });
    } catch (error) {
        console.error("OTP login error:", error);
        return NextResponse.json(
            { error: "שגיאה בהתחברות" },
            { status: 500 }
        );
    }
}
