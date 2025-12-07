import { cookies } from "next/headers";
import * as crypto from "crypto";
import { connectDB } from "../db/mongoClient";
import { User, Tenant, type IUser, type ITenant } from "../db/models";
import * as usersService from "./usersService";

/**
 * Auth Service
 * 
 * JWT-based authentication with httpOnly cookies.
 */

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export interface TokenPayload {
    userId: string;
    tenantId: string;
    email: string;
    role: string;
    exp: number;
}

export interface AuthResult {
    user: IUser;
    tenant: ITenant;
    token: string;
}

export interface SessionData {
    userId: string;
    tenantId: string;
    email: string;
    role: string;
}

/**
 * Simple JWT-like token encoding (for production, use proper JWT library)
 */
export function encodeToken(payload: TokenPayload): string {
    const data = JSON.stringify(payload);
    const signature = crypto
        .createHmac("sha256", JWT_SECRET)
        .update(data)
        .digest("hex");
    const token = Buffer.from(data).toString("base64") + "." + signature;
    return token;
}

/**
 * Decode and verify token
 */
function decodeToken(token: string): TokenPayload | null {
    try {
        const [dataB64, signature] = token.split(".");
        const data = Buffer.from(dataB64, "base64").toString();
        const expectedSignature = crypto
            .createHmac("sha256", JWT_SECRET)
            .update(data)
            .digest("hex");

        if (signature !== expectedSignature) {
            return null;
        }

        const payload = JSON.parse(data) as TokenPayload;

        // Check expiration
        if (payload.exp < Date.now()) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

/**
 * Login with email and password
 */
export async function login(
    email: string,
    password: string
): Promise<AuthResult | null> {
    await connectDB();

    // Validate credentials
    const user = await usersService.validateCredentials(email, password);
    if (!user) {
        return null;
    }

    // Get tenant
    const tenant = await Tenant.findById(user.tenantId);
    if (!tenant) {
        return null;
    }

    // Create token
    const payload: TokenPayload = {
        userId: user._id.toString(),
        tenantId: user.tenantId.toString(),
        email: user.email,
        role: user.role,
        exp: Date.now() + TOKEN_EXPIRY,
    };

    const token = encodeToken(payload);

    return { user, tenant, token };
}

/**
 * Validate token and return session data
 */
export async function validateToken(token: string): Promise<SessionData | null> {
    const payload = decodeToken(token);
    if (!payload) {
        return null;
    }

    return {
        userId: payload.userId,
        tenantId: payload.tenantId,
        email: payload.email,
        role: payload.role,
    };
}

/**
 * Get current session from cookies (Server Component)
 */
export async function getSession(): Promise<SessionData | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return null;
    }

    return validateToken(token);
}

/**
 * Set auth cookie (for API routes)
 */
export function getAuthCookieOptions() {
    return {
        name: "auth_token",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: TOKEN_EXPIRY / 1000, // in seconds
    };
}

/**
 * Create session for user
 */
export async function createSession(user: IUser, tenantId: string) {
    const payload: TokenPayload = {
        userId: user._id.toString(),
        tenantId: tenantId,
        email: user.email,
        role: user.role,
        exp: Date.now() + TOKEN_EXPIRY,
    };

    const token = encodeToken(payload);

    const cookieStore = await cookies();
    const cookieOptions = getAuthCookieOptions();

    cookieStore.set(cookieOptions.name, token, {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
        maxAge: cookieOptions.maxAge,
    });

    return token;
}

/**
 * Create a new tenant with owner user
 */
export async function registerTenant(data: {
    tenantSlug: string;
    tenantName: string;
    ownerEmail: string;
    ownerPassword: string;
    ownerName?: string;
}): Promise<AuthResult | null> {
    await connectDB();

    // Check if slug is available
    const existingTenant = await Tenant.findOne({
        slug: data.tenantSlug.toLowerCase(),
    });
    if (existingTenant) {
        throw new Error("Slug already taken");
    }

    // Check if email is already used
    const existingUser = await User.findOne({
        email: data.ownerEmail.toLowerCase(),
    });
    if (existingUser) {
        throw new Error("Email already registered");
    }

    // Create tenant
    const tenant = await Tenant.create({
        slug: data.tenantSlug.toLowerCase(),
        name: data.tenantName,
        settings: {},
    });

    // Create owner user
    const user = await usersService.createUser({
        tenantId: tenant._id,
        email: data.ownerEmail,
        password: data.ownerPassword,
        role: "owner",
        name: data.ownerName,
    });

    // Create token
    const payload: TokenPayload = {
        userId: user._id.toString(),
        tenantId: tenant._id.toString(),
        email: user.email,
        role: user.role,
        exp: Date.now() + TOKEN_EXPIRY,
    };

    const token = encodeToken(payload);

    return { user, tenant, token };
}
