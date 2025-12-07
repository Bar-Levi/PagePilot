import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * User Model
 * 
 * Users belong to a specific tenant and have role-based access.
 */

export type UserRole = "owner" | "editor" | "viewer";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    email: string;
    passwordHash: string;
    role: UserRole;
    name?: string;
    lastLoginAt?: Date;
    // OTP for first-time login or password reset
    otp?: string;
    otpExpiry?: Date;
    hasSetPassword?: boolean; // Track if user has set their own password
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "Tenant",
            required: [true, "Tenant ID is required"],
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        passwordHash: {
            type: String,
            required: [true, "Password is required"],
            select: false, // Don't include in queries by default
        },
        role: {
            type: String,
            enum: ["owner", "editor", "viewer"],
            default: "editor",
        },
        name: {
            type: String,
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        lastLoginAt: Date,
        otp: {
            type: String,
            select: false, // Don't include in queries by default
        },
        otpExpiry: {
            type: Date,
            select: false,
        },
        hasSetPassword: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index: email must be unique within a tenant
UserSchema.index({ email: 1, tenantId: 1 }, { unique: true });
UserSchema.index({ tenantId: 1, role: 1 });

// Prevent model recompilation in development
export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
