import { connectDB } from "../db/mongoClient";
import { User, type IUser, type UserRole } from "../db/models";
import type { Types } from "mongoose";
import * as crypto from "crypto";

/**
 * Users Service
 * 
 * User management with tenant scoping.
 */

export interface CreateUserInput {
    tenantId: Types.ObjectId | string;
    email: string;
    password: string;
    role?: UserRole;
    name?: string;
}

export interface UpdateUserInput {
    name?: string;
    role?: UserRole;
}

// Simple password hashing using Node crypto (for production, consider bcrypt)
const SALT_ROUNDS = 16;

function hashPassword(password: string): string {
    const salt = crypto.randomBytes(SALT_ROUNDS).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(":");
    const verifyHash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return hash === verifyHash;
}

/**
 * Generate OTP code
 */
export function generateOTP(): string {
    return Math.random().toString(36).slice(-8).toUpperCase();
}

/**
 * Set OTP for user (for first-time login or password reset)
 */
export async function setUserOTP(
    email: string,
    otpExpiryMinutes: number = 30
): Promise<{ otp: string; user: IUser } | null> {
    console.log("🔐 setUserOTP called for:", email);
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        console.log("❌ User not found in setUserOTP");
        return null;
    }

    console.log("✅ User found, generating OTP...");
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);

    console.log("💾 Saving OTP to database:", { otp, expiresAt: otpExpiry });
    await User.findByIdAndUpdate(user._id, {
        otp,
        otpExpiry,
    });

    console.log("✅ OTP saved successfully");
    return { otp, user };
}

/**
 * Validate OTP
 */
export async function validateOTP(
    email: string,
    otp: string
): Promise<IUser | null> {
    console.log("\n🔍 validateOTP called:", { email, otp });
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() })
        .select("+otp +otpExpiry");

    if (!user) {
        console.log("❌ User not found for email:", email);
        return null;
    }

    console.log("✅ User found:", {
        userId: user._id,
        hasOtp: !!user.otp,
        hasOtpExpiry: !!user.otpExpiry,
        storedOtp: user.otp,
        otpExpiry: user.otpExpiry,
    });

    if (!user.otp || !user.otpExpiry) {
        console.log("❌ User has no OTP or expiry set");
        return null;
    }

    // Check if OTP expired
    const now = new Date();
    if (user.otpExpiry < now) {
        console.log("❌ OTP expired:", {
            expiry: user.otpExpiry,
            now,
            diff: (now.getTime() - user.otpExpiry.getTime()) / 1000 / 60,
        });
        return null;
    }

    console.log("✅ OTP not expired");

    // Check if OTP matches
    const normalizedInputOtp = otp.toUpperCase();
    const normalizedStoredOtp = user.otp.toUpperCase();

    console.log("🔐 Comparing OTPs:", {
        input: normalizedInputOtp,
        stored: normalizedStoredOtp,
        match: normalizedInputOtp === normalizedStoredOtp,
    });

    if (normalizedStoredOtp !== normalizedInputOtp) {
        console.log("❌ OTP mismatch");
        return null;
    }

    console.log("✅ OTP matches! Clearing OTP and updating last login...");

    // Clear OTP after successful validation
    await User.findByIdAndUpdate(user._id, {
        $unset: { otp: 1, otpExpiry: 1 },
        lastLoginAt: new Date(),
    });

    // Return user without sensitive fields
    const userObj = user.toObject();
    delete (userObj as any).otp;
    delete (userObj as any).otpExpiry;
    delete (userObj as any).passwordHash;

    console.log("✅ Returning validated user");
    return userObj as IUser;
}

/**
 * Set user password (first time or reset)
 */
export async function setUserPassword(
    userId: Types.ObjectId | string,
    newPassword: string
): Promise<boolean> {
    await connectDB();

    const result = await User.findByIdAndUpdate(userId, {
        passwordHash: hashPassword(newPassword),
        hasSetPassword: true,
    });

    return !!result;
}

/**
 * Get user by email within a tenant
 */
export async function getUserByEmail(
    email: string,
    tenantId: Types.ObjectId | string
): Promise<IUser | null> {
    await connectDB();
    return User.findOne({
        email: email.toLowerCase(),
        tenantId,
    });
}

/**
 * Get user by email (global search for login)
 * Returns user with password hash for authentication
 */
export async function getUserByEmailForAuth(
    email: string
): Promise<IUser | null> {
    await connectDB();
    return User.findOne({ email: email.toLowerCase() }).select("+passwordHash +hasSetPassword");
}

/**
 * Get user by ID
 */
export async function getUserById(
    id: Types.ObjectId | string
): Promise<IUser | null> {
    await connectDB();
    return User.findById(id);
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserInput): Promise<IUser> {
    await connectDB();
    const user = new User({
        tenantId: data.tenantId,
        email: data.email.toLowerCase(),
        passwordHash: hashPassword(data.password),
        role: data.role || "editor",
        name: data.name,
        hasSetPassword: false, // Will be true when user sets their own password
    });
    return user.save();
}

/**
 * Validate user credentials
 * Returns user without password hash if valid, null if invalid
 */
export async function validateCredentials(
    email: string,
    password: string
): Promise<IUser | null> {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() }).select(
        "+passwordHash"
    );

    if (!user || !user.passwordHash) {
        return null;
    }

    if (!verifyPassword(password, user.passwordHash)) {
        return null;
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    // Return user without password hash
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    return userObj as IUser;
}

/**
 * Update user
 */
export async function updateUser(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string,
    data: UpdateUserInput
): Promise<IUser | null> {
    await connectDB();
    return User.findOneAndUpdate(
        { _id: id, tenantId }, // Ensure tenant matching
        { $set: data },
        { new: true, runValidators: true }
    );
}

/**
 * Change user password
 */
export async function changePassword(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string,
    newPassword: string
): Promise<boolean> {
    await connectDB();
    const result = await User.findOneAndUpdate(
        { _id: id, tenantId },
        {
            passwordHash: hashPassword(newPassword),
            hasSetPassword: true,
        }
    );
    return !!result;
}

/**
 * Delete user
 */
export async function deleteUser(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string
): Promise<boolean> {
    await connectDB();
    const result = await User.findOneAndDelete({ _id: id, tenantId });
    return !!result;
}

/**
 * List users for a tenant
 */
export async function listUsersByTenant(
    tenantId: Types.ObjectId | string
): Promise<IUser[]> {
    await connectDB();
    return User.find({ tenantId }).sort({ createdAt: -1 });
}
