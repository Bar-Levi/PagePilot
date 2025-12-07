import { connectDB } from "../db/mongoClient";
import { Tenant, type ITenant } from "../db/models";
import type { Types } from "mongoose";

/**
 * Tenants Service
 * 
 * CRUD operations for tenant management.
 */

export interface CreateTenantInput {
    slug: string;
    name: string;
    settings?: ITenant["settings"];
}

export interface UpdateTenantInput {
    name?: string;
    settings?: ITenant["settings"];
}

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string): Promise<ITenant | null> {
    await connectDB();
    return Tenant.findOne({ slug: slug.toLowerCase() });
}

/**
 * Get tenant by ID
 */
export async function getTenantById(
    id: Types.ObjectId | string
): Promise<ITenant | null> {
    await connectDB();
    return Tenant.findById(id);
}

/**
 * Create a new tenant
 */
export async function createTenant(data: CreateTenantInput): Promise<ITenant> {
    await connectDB();
    const tenant = new Tenant({
        slug: data.slug.toLowerCase(),
        name: data.name,
        settings: data.settings || {},
    });
    return tenant.save();
}

/**
 * Update tenant
 */
export async function updateTenant(
    id: Types.ObjectId | string,
    data: UpdateTenantInput
): Promise<ITenant | null> {
    await connectDB();
    return Tenant.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    );
}

/**
 * Delete tenant
 * WARNING: This should also clean up related users, landing pages, and leads
 */
export async function deleteTenant(
    id: Types.ObjectId | string
): Promise<boolean> {
    await connectDB();
    const result = await Tenant.findByIdAndDelete(id);
    return !!result;
}

/**
 * Check if slug is available
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
    await connectDB();
    const existing = await Tenant.findOne({ slug: slug.toLowerCase() });
    return !existing;
}

/**
 * List all tenants (admin only)
 */
export async function listTenants(
    options: { limit?: number; skip?: number } = {}
): Promise<ITenant[]> {
    await connectDB();
    return Tenant.find()
        .sort({ createdAt: -1 })
        .skip(options.skip || 0)
        .limit(options.limit || 50);
}
