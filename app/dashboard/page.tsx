import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { getTenantByDomain } from "@/lib/tenants";
import { getThemeColors } from "@/lib/themes";
import { getUserById } from "@/lib/users";
import Header from "@/components/organisms/Header";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/tenant/login");
  }

  // Get current tenant from domain
  const host = headers().get("host") ?? "";
  const currentTenant = host ? await getTenantByDomain(host) : null;

  if (!currentTenant) {
    redirect("/tenant/login");
  }

  // CRITICAL: Verify session belongs to current tenant
  if (session.tenantId !== currentTenant.id) {
    // Session belongs to different tenant - invalid for this domain
    redirect("/tenant/login");
  }

  const user = await getUserById(session.userId);

  if (!user) {
    redirect("/tenant/login");
  }

  // Get theme colors for consistent styling
  const themeId = currentTenant?.theme || null;
  const colors = getThemeColors(themeId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header title="Dashboard" userEmail={user.email} colors={colors} />

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

