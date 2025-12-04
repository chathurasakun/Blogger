import { prisma } from "./prisma";

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  theme: string;
}

export async function getTenantByDomain(domain: string) {
  // All tenants now have domains with ports (e.g., "tenanta.localhost:3004")
  // Direct lookup is sufficient
  return prisma.tenant.findUnique({
    where: { domain },
  });
}

export async function getAllTenants() {
  try {
    return await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
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
