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
  return prisma.tenant.findMany({
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
}
