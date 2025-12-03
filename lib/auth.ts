import { prisma } from "./prisma";
import { cookies } from "next/headers";

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

  // Set cookie
  cookies().set("session", session.id, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return session;
}
