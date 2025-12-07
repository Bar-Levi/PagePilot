import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Lead Model
 * 
 * Captures form submissions from public landing pages.
 * Each lead belongs to a tenant and optionally a specific landing page.
 */

export type LeadStatus = "new" | "contacted" | "qualified" | "lost" | "won";
export type PipelineStage = "TO_DO" | "IN_PROGRESS" | "WON" | "LOST";

export interface ILead extends Document {
    _id: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    landingPageId?: mongoose.Types.ObjectId;
    contactInfo: {
        name?: string;
        email: string;
        phone?: string;
    };
    status: LeadStatus;
    pipelineStage: PipelineStage;
    meta: Record<string, any>; // Additional form fields
    notes?: string;
    source?: string; // UTM source or referrer
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "Tenant",
            required: [true, "Tenant ID is required"],
            index: true,
        },
        landingPageId: {
            type: Schema.Types.ObjectId,
            ref: "LandingPage",
            index: true,
        },
        contactInfo: {
            name: {
                type: String,
                trim: true,
                maxlength: [100, "Name cannot exceed 100 characters"],
            },
            email: {
                type: String,
                required: [true, "Email is required"],
                lowercase: true,
                trim: true,
                match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
            },
            phone: {
                type: String,
                trim: true,
            },
        },
        status: {
            type: String,
            enum: ["new", "contacted", "qualified", "lost", "won"],
            default: "new",
        },
        pipelineStage: {
            type: String,
            enum: ["TO_DO", "IN_PROGRESS", "WON", "LOST"],
            default: "TO_DO",
        },
        meta: {
            type: Schema.Types.Mixed,
            default: {},
        },
        notes: String,
        source: String,
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient querying
LeadSchema.index({ tenantId: 1, status: 1 });
LeadSchema.index({ tenantId: 1, pipelineStage: 1 });
LeadSchema.index({ tenantId: 1, createdAt: -1 });
LeadSchema.index({ "contactInfo.email": 1, tenantId: 1 });

// Prevent model recompilation in development
export const Lead: Model<ILead> =
    mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
