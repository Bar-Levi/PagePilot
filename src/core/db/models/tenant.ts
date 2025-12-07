import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Tenant Model
 * 
 * Represents a business/organization using PagePilot.
 * Each tenant has their own landing pages and leads.
 */

export interface ITenant extends Document {
    _id: mongoose.Types.ObjectId;
    slug: string;
    name: string;
    settings: {
        theme?: {
            primaryColor?: string;
            secondaryColor?: string;
            fontFamily?: string;
        };
        integrations?: {
            googleAnalytics?: string;
            microsoftClarity?: string;
            sheetsWebhook?: string;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
    {
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
            minlength: [3, "Slug must be at least 3 characters"],
            maxlength: [50, "Slug cannot exceed 50 characters"],
        },
        name: {
            type: String,
            required: [true, "Business name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        settings: {
            theme: {
                primaryColor: String,
                secondaryColor: String,
                fontFamily: String,
            },
            integrations: {
                googleAnalytics: String,
                microsoftClarity: String,
                sheetsWebhook: String,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
TenantSchema.index({ slug: 1 }, { unique: true });
TenantSchema.index({ createdAt: -1 });

// Prevent model recompilation in development
export const Tenant: Model<ITenant> =
    mongoose.models.Tenant || mongoose.model<ITenant>("Tenant", TenantSchema);

export default Tenant;
