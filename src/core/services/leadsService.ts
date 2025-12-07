import { connectDB } from "../db/mongoClient";
import {
    Lead,
    type ILead,
    type LeadStatus,
    type PipelineStage,
} from "../db/models";
import type { Types } from "mongoose";

/**
 * Leads Service
 * 
 * CRM operations with tenant isolation.
 */

export interface CreateLeadInput {
    tenantId: Types.ObjectId | string;
    landingPageId?: Types.ObjectId | string;
    contactInfo: {
        name?: string;
        email: string;
        phone?: string;
    };
    meta?: Record<string, any>;
    source?: string;
}

export interface UpdateLeadInput {
    status?: LeadStatus;
    pipelineStage?: PipelineStage;
    notes?: string;
    meta?: Record<string, any>;
}

/**
 * Get lead by ID (tenant-scoped)
 */
export async function getLeadById(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string
): Promise<ILead | null> {
    await connectDB();
    return Lead.findOne({ _id: id, tenantId });
}

/**
 * Create a new lead (from form submission)
 */
export async function createLead(data: CreateLeadInput): Promise<ILead> {
    await connectDB();
    const lead = new Lead({
        tenantId: data.tenantId,
        landingPageId: data.landingPageId,
        contactInfo: {
            name: data.contactInfo.name,
            email: data.contactInfo.email.toLowerCase(),
            phone: data.contactInfo.phone,
        },
        status: "new",
        pipelineStage: "TO_DO",
        meta: data.meta || {},
        source: data.source,
    });
    return lead.save();
}

/**
 * Update lead status
 */
export async function updateLeadStatus(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string,
    status: LeadStatus
): Promise<ILead | null> {
    await connectDB();
    return Lead.findOneAndUpdate(
        { _id: id, tenantId },
        { status },
        { new: true }
    );
}

/**
 * Update lead pipeline stage
 */
export async function updateLeadPipelineStage(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string,
    pipelineStage: PipelineStage
): Promise<ILead | null> {
    await connectDB();
    return Lead.findOneAndUpdate(
        { _id: id, tenantId },
        { pipelineStage },
        { new: true }
    );
}

/**
 * Update lead (general update)
 */
export async function updateLead(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string,
    data: UpdateLeadInput
): Promise<ILead | null> {
    await connectDB();
    return Lead.findOneAndUpdate(
        { _id: id, tenantId },
        { $set: data },
        { new: true, runValidators: true }
    );
}

/**
 * Delete lead
 */
export async function deleteLead(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string
): Promise<boolean> {
    await connectDB();
    const result = await Lead.findOneAndDelete({ _id: id, tenantId });
    return !!result;
}

/**
 * List leads for a tenant
 */
export async function listLeadsByTenant(
    tenantId: Types.ObjectId | string,
    options: {
        status?: LeadStatus;
        pipelineStage?: PipelineStage;
        limit?: number;
        skip?: number;
    } = {}
): Promise<ILead[]> {
    await connectDB();

    const query: any = { tenantId };
    if (options.status) {
        query.status = options.status;
    }
    if (options.pipelineStage) {
        query.pipelineStage = options.pipelineStage;
    }

    return Lead.find(query)
        .sort({ createdAt: -1 })
        .skip(options.skip || 0)
        .limit(options.limit || 100);
}

/**
 * List leads by landing page
 */
export async function listLeadsByLandingPage(
    landingPageId: Types.ObjectId | string,
    tenantId: Types.ObjectId | string
): Promise<ILead[]> {
    await connectDB();
    return Lead.find({ landingPageId, tenantId }).sort({ createdAt: -1 });
}

/**
 * Get lead stats for a tenant
 */
export async function getLeadStats(
    tenantId: Types.ObjectId | string
): Promise<{
    total: number;
    byStatus: Record<LeadStatus, number>;
    byPipelineStage: Record<PipelineStage, number>;
}> {
    await connectDB();

    const [total, statusAgg, pipelineAgg] = await Promise.all([
        Lead.countDocuments({ tenantId }),
        Lead.aggregate([
            { $match: { tenantId } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Lead.aggregate([
            { $match: { tenantId } },
            { $group: { _id: "$pipelineStage", count: { $sum: 1 } } },
        ]),
    ]);

    const byStatus: Record<LeadStatus, number> = {
        new: 0,
        contacted: 0,
        qualified: 0,
        lost: 0,
        won: 0,
    };
    statusAgg.forEach((item: any) => {
        byStatus[item._id as LeadStatus] = item.count;
    });

    const byPipelineStage: Record<PipelineStage, number> = {
        TO_DO: 0,
        IN_PROGRESS: 0,
        WON: 0,
        LOST: 0,
    };
    pipelineAgg.forEach((item: any) => {
        byPipelineStage[item._id as PipelineStage] = item.count;
    });

    return { total, byStatus, byPipelineStage };
}
