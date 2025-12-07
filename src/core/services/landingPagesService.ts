import { connectDB } from "../db/mongoClient";
import { LandingPage, type ILandingPage, type LandingPageStatus } from "../db/models";
import { Tenant } from "../db/models";
import type { PageComponent } from "@/components/landing-page/types";
import type { Types } from "mongoose";

/**
 * Landing Pages Service
 * 
 * CRUD operations with tenant isolation and publish workflow.
 */

export interface CreateLandingPageInput {
    tenantId: Types.ObjectId | string;
    title: string;
    config: PageComponent;
    seoTitle?: string;
    seoDescription?: string;
}

export interface UpdateLandingPageInput {
    title?: string;
    config?: PageComponent;
    seoTitle?: string;
    seoDescription?: string;
}

/**
 * Get landing page by ID (tenant-scoped)
 */
export async function getLandingPageById(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string
): Promise<ILandingPage | null> {
    await connectDB();
    return LandingPage.findOne({ _id: id, tenantId });
}

/**
 * Get published landing page by tenant slug
 * This is used for public rendering at /l/[slug]
 */
export async function getPublishedLandingPageBySlug(
    slug: string
): Promise<{ page: ILandingPage; tenant: any } | null> {
    await connectDB();

    // First find the tenant by slug
    const tenant = await Tenant.findOne({ slug: slug.toLowerCase() });
    if (!tenant) {
        return null;
    }

    // Find the published landing page for this tenant
    // We'll get the first published page - in future could support multiple pages
    const page = await LandingPage.findOne({
        tenantId: tenant._id,
        status: "published",
    }).sort({ publishedAt: -1 });

    if (!page) {
        return null;
    }

    return { page, tenant };
}

/**
 * Create a new landing page
 */
export async function createLandingPage(
    data: CreateLandingPageInput
): Promise<ILandingPage> {
    await connectDB();
    const landingPage = new LandingPage({
        tenantId: data.tenantId,
        title: data.title,
        config: data.config,
        status: "draft",
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
    });
    return landingPage.save();
}

/**
 * Update landing page (draft only)
 */
export async function updateLandingPage(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string,
    data: UpdateLandingPageInput
): Promise<ILandingPage | null> {
    await connectDB();
    return LandingPage.findOneAndUpdate(
        { _id: id, tenantId },
        { $set: data },
        { new: true, runValidators: true }
    );
}

/**
 * Publish landing page
 * Copies current config to publishedConfig and sets status to published
 */
export async function publishLandingPage(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string
): Promise<ILandingPage | null> {
    await connectDB();

    const page = await LandingPage.findOne({ _id: id, tenantId });
    if (!page) {
        return null;
    }

    page.status = "published";
    page.publishedAt = new Date();
    page.publishedConfig = page.config; // Snapshot for public rendering

    return page.save();
}

/**
 * Unpublish landing page (revert to draft)
 */
export async function unpublishLandingPage(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string
): Promise<ILandingPage | null> {
    await connectDB();
    return LandingPage.findOneAndUpdate(
        { _id: id, tenantId },
        { status: "draft" },
        { new: true }
    );
}

/**
 * Delete landing page
 */
export async function deleteLandingPage(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string
): Promise<boolean> {
    await connectDB();
    const result = await LandingPage.findOneAndDelete({ _id: id, tenantId });
    return !!result;
}

/**
 * List landing pages for a tenant
 */
export async function listLandingPagesByTenant(
    tenantId: Types.ObjectId | string,
    options: { status?: LandingPageStatus; limit?: number; skip?: number } = {}
): Promise<ILandingPage[]> {
    await connectDB();

    const query: any = { tenantId };
    if (options.status) {
        query.status = options.status;
    }

    return LandingPage.find(query)
        .sort({ updatedAt: -1 })
        .skip(options.skip || 0)
        .limit(options.limit || 50);
}

/**
 * Duplicate landing page
 */
export async function duplicateLandingPage(
    id: Types.ObjectId | string,
    tenantId: Types.ObjectId | string
): Promise<ILandingPage | null> {
    await connectDB();

    const original = await LandingPage.findOne({ _id: id, tenantId });
    if (!original) {
        return null;
    }

    const duplicate = new LandingPage({
        tenantId: original.tenantId,
        title: `${original.title} (עותק)`,
        config: original.config,
        status: "draft",
        seoTitle: original.seoTitle,
        seoDescription: original.seoDescription,
    });

    return duplicate.save();
}
