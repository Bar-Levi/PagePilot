import { NextRequest, NextResponse } from "next/server";
import { getUserByEmailForAuth, setUserPassword } from "@/core/services/usersService";

/**
 * Set Password API Route
 * POST /api/auth/set-password
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "הסיסמה חייבת להכיל לפחות 6 תווים" },
                { status: 400 }
            );
        }

        // Verify session
        const { getSession } = await import("@/core/services/authService");
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: "אינך מחובר. אנא התחבר מחדש." },
                { status: 401 }
            );
        }

        // Verify email matches session
        if (session.email.toLowerCase() !== email.toLowerCase()) {
            return NextResponse.json(
                { error: "אינך מורשה לשנות סיסמה למשתמש זה" },
                { status: 403 }
            );
        }

        // Get user
        const user = await getUserByEmailForAuth(email);
        if (!user) {
            return NextResponse.json(
                { error: "משתמש לא נמצא" },
                { status: 404 }
            );
        }

        // Set password
        const success = await setUserPassword(user._id, password);

        if (!success) {
            return NextResponse.json(
                { error: "שגיאה בהגדרת סיסמה" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "הסיסמה נשמרה בהצלחה",
        });
    } catch (error) {
        console.error("Set password error:", error);
        return NextResponse.json(
            { error: "שגיאה בהגדרת סיסמה" },
            { status: 500 }
        );
    }
}
