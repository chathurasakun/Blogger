import { prisma } from "./prisma";

export interface Tenant {
  id: string;
  name: string;
  blogName?: string | null;
  logo?: string | null;
  domain: string;
  theme: string;
}

export async function getTenantByDomain(domain: string) {
  // All tenants now have domains with ports (e.g., "tenanta.localhost:3004")
  // Direct lookup is sufficient
  return prisma.tenant.findUnique({
    where: { domain },
    select: {
      id: true,
      name: true,
      blogName: true,
      logo: true,
      domain: true,
      theme: true,
    },
  });
}

export async function getAllTenants() {
  try {
    return await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        blogName: true,
        logo: true,
        domain: true,
        theme: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    // If database is not available (e.g., during build), return empty array
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      console.warn('Database not available, returning empty tenants list');
      return [];
    }
    // Re-throw other errors
    throw error;
  }
}

export async function getTenantById(tenantId: string) {
  return prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      name: true,
      blogName: true,
      logo: true,
      domain: true,
      theme: true,
    },
  });
}

interface UpdateTenantParams {
  tenantId: string;
  blogName?: string | null;
  logo?: string | null;
}

export async function updateTenant({ tenantId, blogName, logo }: UpdateTenantParams) {
  const updateData: { blogName?: string | null; logo?: string | null } = {};
  
  // Allow setting to null/empty to remove values
  if (blogName !== undefined) {
    updateData.blogName = blogName && blogName.trim() ? blogName.trim() : null;
  }
  
  if (logo !== undefined) {
    updateData.logo = logo && logo.trim() ? logo.trim() : null;
  }

  return prisma.tenant.update({
    where: { id: tenantId },
    data: updateData,
    select: {
      id: true,
      name: true,
      blogName: true,
      logo: true,
      domain: true,
      theme: true,
    },
  });
}

export async function isUserAdmin(userId: string, tenantId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, tenantId: true },
  });

  if (!user || user.tenantId !== tenantId) {
    return false;
  }

  return user.role === "admin";
}
