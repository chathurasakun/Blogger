import { prisma } from "./prisma";

export async function getTenantByDomain(domain: string) {
  return prisma.tenant.findUnique({
    where: { domain },
  });
}
