import { NextRequest, NextResponse } from "next/server";
import { registerTenant } from "@/core/services/authService";
import { createLandingPage } from "@/core/services/landingPagesService";
import type { PageComponent } from "@/components/landing-page/types";

/**
 * Create Landing Page + Auto Register
 * POST /api/create-landing-page
 * 
 * Creates a landing page and automatically registers the tenant/user
 * Sends OTP email for first-time login
 */
export async function POST(request: NextRequest) {
    console.log("\n🚀 === CREATE LANDING PAGE + AUTO REGISTER ===");

    try {
        const body = await request.json();
        const { businessName, email, pageConfig, businessSlug } = body;

        console.log("📥 Request data:", { businessName, email, hasPageConfig: !!pageConfig });

        // Validate required fields
        if (!businessName || !email || !pageConfig) {
            console.log("❌ Missing required fields");
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate slug from business name if not provided
        const slug =
            businessSlug ||
            businessName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

        console.log("🔤 Generated slug:", slug);

        // Generate temporary password (will be replaced when user sets their own)
        const tempPassword = Math.random().toString(36).slice(-12);

        console.log("👤 Creating tenant and user...");

        // Register tenant and owner
        let result;
        try {
            result = await registerTenant({
                tenantSlug: slug,
                tenantName: businessName,
                ownerEmail: email,
                ownerPassword: tempPassword,
                ownerName: businessName,
            });

            if (!result) {
                throw new Error("Registration failed");
            }

            console.log("✅ Tenant created:", {
                tenantId: result.tenant._id,
                slug: result.tenant.slug,
                userId: result.user._id,
            });
        } catch (error: any) {
            if (error.message?.includes("Slug already taken")) {
                console.log("⚠️ Slug taken, trying with random suffix...");
                const randomSlug = `${slug}-${Math.random().toString(36).slice(-4)}`;
                result = await registerTenant({
                    tenantSlug: randomSlug,
                    tenantName: businessName,
                    ownerEmail: email,
                    ownerPassword: tempPassword,
                    ownerName: businessName,
                });
                console.log("✅ Tenant created with random slug:", randomSlug);
            } else {
                console.error("❌ Tenant creation failed:", error.message);
                throw error;
            }
        }

        if (!result) {
            console.log("❌ Registration returned null");
            return NextResponse.json(
                { error: "Failed to create account" },
                { status: 500 }
            );
        }

        console.log("📄 Creating landing page...");

        // Create the landing page
        const landingPage = await createLandingPage({
            tenantId: result.tenant._id,
            title: `דף נחיתה - ${businessName}`,
            config: pageConfig as PageComponent,
        });

        console.log("✅ Landing page created:", landingPage._id);

        // Publish the page immediately so it's accessible
        const { publishLandingPage } = await import("@/core/services/landingPagesService");
        await publishLandingPage(landingPage._id, result.tenant._id);
        console.log("✅ Landing page published");

        // Generate and save OTP for first login
        console.log("🔐 Generating OTP...");
        const { setUserOTP } = await import("@/core/services/usersService");
        const otpResult = await setUserOTP(email, 30); // 30 minutes expiry

        if (!otpResult) {
            console.log("❌ OTP generation failed");
            return NextResponse.json(
                { error: "Failed to generate login code" },
                { status: 500 }
            );
        }

        const { otp } = otpResult;
        console.log("✅ OTP generated:", otp);

        // Send welcome email
        const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002"}/l/${result.tenant.slug}`;
        const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002"}/app/login`;

        console.log("📧 Sending welcome email...");
        const { sendWelcomeEmail } = await import("@/core/services/emailService");
        const emailResult = await sendWelcomeEmail({
            to: email,
            businessName,
            otp,
            publicUrl,
            loginUrl,
        });

        if (!emailResult.success) {
            console.log("⚠️ Welcome email failed to send, but account was created");
        }

        // Log for development
        console.log("\n📧 === EMAIL STATUS ===");
        console.log("To:", email);
        console.log("Email sent:", emailResult.success ? "✅ Yes" : "❌ No");
        console.log("OTP:", otp);
        console.log("Public URL:", publicUrl);
        console.log("Login URL:", loginUrl);
        console.log("======================\n");

        console.log("✅ === PROCESS COMPLETE ===\n");

        return NextResponse.json({
            success: true,
            message: "דף הנחיתה נוצר בהצלחה!",
            tenant: {
                id: result.tenant._id,
                slug: result.tenant.slug,
                name: result.tenant.name,
            },
            landingPage: {
                id: landingPage._id,
                title: landingPage.title,
            },
            publicUrl,
            loginUrl,
            // TEMPORARY: Remove in production!
            tempOtp: otp,
            tempEmail: email,
        });
    } catch (error: any) {
        console.error("❌ === CREATE LANDING PAGE ERROR ===");
        console.error(error);

        if (error.message?.includes("Email already registered")) {
            return NextResponse.json(
                {
                    error: "המייל כבר רשום במערכת. התחבר עם הסיסמה או בקש קוד חדש.",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "שגיאה ביצירת דף הנחיתה" },
            { status: 500 }
        );
    }
}
