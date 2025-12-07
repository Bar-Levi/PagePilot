import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { login, getAuthCookieOptions } from "@/core/services/authService";

/**
 * Login API Route
 * POST /api/auth/login
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

        const result = await login(email, password);

        if (!result) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Create session
        const { createSession } = await import("@/core/services/authService");
        await createSession(result.user, result.tenant._id.toString());

        // Return user info (without sensitive data)
        return NextResponse.json({
            success: true,
            user: {
                id: result.user._id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role,
            },
            tenant: {
                id: result.tenant._id,
                slug: result.tenant.slug,
                name: result.tenant.name,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
