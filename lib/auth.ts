import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getTenantByDomain, Tenant } from "./tenants";

export interface Session {
    id: string;
    userId: string;
    tenantId: string;
    expiresAt: string;
}

export async function getSession() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (!sessionId) return null;

  return prisma.session.findUnique({
    where: { id: sessionId },
  });
}

export function validateTenantSession(session: Session, tenantId: string) {
  if (!session) return false;
  return session.tenantId === tenantId;
}

export async function createSession(userId: string, tenantId: string) {
  const session = await prisma.session.create({
    data: {
      userId,
      tenantId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    },
  });

  // Set cookie with security best practices
  cookies().set("session", session.id, {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax", // CSRF protection
    path: "/",
    // Note: maxAge is handled by expiresAt in database
  });

  return session;
}

/**
 * Validates authentication and tenant for API routes.
 * Returns either an error response or validated session data.
 */
export async function validateAuthAndTenant(
  request: NextRequest
): Promise<
  | { error: NextResponse; userId?: never; tenantId?: never; tenant?: never }
  | { error?: never; userId: string; tenantId: string; tenant: Tenant }
> {
  // Check authentication
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  // Extract userId and tenantId with proper type handling
  const userId = session.userId;
  const tenantId = session.tenantId;

  // Ensure session has required fields
  if (!userId || !tenantId) {
    return {
      error: NextResponse.json({ error: "Invalid session" }, { status: 401 }),
    };
  }

  // Get the current tenant from the domain
  const host = request.headers.get("host") ?? "";
  const tenant = host ? await getTenantByDomain(host) : null;

  if (!tenant) {
    return {
      error: NextResponse.json(
        { error: "Invalid tenant domain" },
        { status: 400 }
      ),
    };
  }

  // Verify session belongs to current tenant
  if (tenantId !== tenant.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { userId, tenantId, tenant };
}
