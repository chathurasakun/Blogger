import { prisma } from "./prisma";

export async function getTenantByDomain(domain: string) {
  // All tenants now have domains with ports (e.g., "tenanta.localhost:3004")
  // Direct lookup is sufficient
  return prisma.tenant.findUnique({
    where: { domain },
  });
}
