import { NextRequest, NextResponse } from "next/server";
import { setUserOTP } from "@/core/services/usersService";

/**
 * Send OTP API Route
 * POST /api/auth/send-otp
 */
export async function POST(request: NextRequest) {
    console.log("\n📧 === SEND OTP REQUEST ===");

    try {
        const body = await request.json();
        const { email } = body;

        console.log("📥 Request to send OTP to:", email);

        if (!email) {
            console.log("❌ Email missing");
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const result = await setUserOTP(email, 30); // 30 minutes

        if (!result) {
            console.log("❌ User not found for email:", email);
            return NextResponse.json(
                { error: "משתמש לא נמצא" },
                { status: 404 }
            );
        }

        // Send OTP email
        console.log("📧 Sending OTP email...");
        const { sendOTPEmail } = await import("@/core/services/emailService");
        const emailResult = await sendOTPEmail({
            to: email,
            businessName: result.user.name || "משתמש",
            otp: result.otp,
            publicUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002"}/l/tenant-slug`,
            loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002"}/app/login`,
        });

        if (!emailResult.success) {
            console.log("⚠️ Email failed to send, but OTP was generated");
        }

        // Log OTP for development
        console.log("\n" + "=".repeat(60));
        console.log("🔐 OTP GENERATED FOR:", email);
        console.log("📋 CODE:", result.otp);
        console.log("⏰ EXPIRES IN: 30 minutes");
        console.log("📧 Email sent:", emailResult.success ? "✅ Yes" : "❌ No");
        console.log("=".repeat(60) + "\n");

        return NextResponse.json({
            success: true,
            message: "קוד נשלח למייל",
        });
    } catch (error) {
        console.error("❌ Send OTP error:", error);
        return NextResponse.json(
            { error: "שגיאה בשליחת קוד" },
            { status: 500 }
        );
    }
}
