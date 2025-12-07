import mongoose, { Schema, Document, Model } from "mongoose";
import type { PageComponent } from "@/components/landing-page/types";

/**
 * Landing Page Model
 * 
 * Stores the full page configuration (components, layout, styles).
 * Each landing page belongs to a tenant.
 */

export type LandingPageStatus = "draft" | "published";

export interface ILandingPage extends Document {
    _id: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    title: string;
    config: PageComponent; // The full page JSON structure
    status: LandingPageStatus;
    publishedAt?: Date;
    publishedConfig?: PageComponent; // Snapshot of config at publish time
    seoTitle?: string;
    seoDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LandingPageSchema = new Schema<ILandingPage>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "Tenant",
            required: [true, "Tenant ID is required"],
            index: true,
        },
        title: {
            type: String,
            required: [true, "Page title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        config: {
            type: Schema.Types.Mixed,
            required: [true, "Page config is required"],
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
        publishedAt: Date,
        publishedConfig: {
            type: Schema.Types.Mixed,
        },
        seoTitle: {
            type: String,
            maxlength: [70, "SEO title cannot exceed 70 characters"],
        },
        seoDescription: {
            type: String,
            maxlength: [160, "SEO description cannot exceed 160 characters"],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
LandingPageSchema.index({ tenantId: 1, status: 1 });
LandingPageSchema.index({ tenantId: 1, createdAt: -1 });

// Prevent model recompilation in development
export const LandingPage: Model<ILandingPage> =
    mongoose.models.LandingPage ||
    mongoose.model<ILandingPage>("LandingPage", LandingPageSchema);

export default LandingPage;
