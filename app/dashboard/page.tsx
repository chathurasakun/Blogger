import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantByDomain } from "@/lib/tenants";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Get current tenant from domain
  const host = headers().get("host") ?? "";
  const currentTenant = host ? await getTenantByDomain(host) : null;

  if (!currentTenant) {
    redirect("/login");
  }

  // CRITICAL: Verify session belongs to current tenant
  if (session.tenantId !== currentTenant.id) {
    // Session belongs to different tenant - invalid for this domain
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { tenant: true },
  });

  if (!user) {
    redirect("/login");
  }

  // Log session details (check your terminal/server logs)
  console.log("Session details:", {
    sessionId: session.id,
    userId: session.userId,
    tenantId: session.tenantId,
    expiresAt: session.expiresAt,
    userEmail: user.email,
    tenantName: user.tenant.name,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Welcome back!</h2>
          <p className="text-slate-300">
            You are logged in as <strong>{user.email}</strong> from{" "}
            <strong>{user.tenant.name}</strong>.
          </p>
        </div>
      </main>
    </div>
  );
}

