import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Logout API Route
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("auth_token");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
