import { prisma } from "./prisma";

export interface UserWithTenant {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    domain: string;
    theme: string;
  };
}

/**
 * Get user by ID with tenant information
 */
export async function getUserById(userId: string): Promise<UserWithTenant | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { tenant: true },
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Check if user exists by email
 */
export async function userExistsByEmail(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user !== null;
}

/**
 * Create a new user
 */
export async function createUser(data: {
  email: string;
  password: string;
  tenantId: string;
  role?: "admin" | "member";
}) {
  return prisma.user.create({
    data: {
      ...data,
      role: data.role || "member",
    },
  });
}

