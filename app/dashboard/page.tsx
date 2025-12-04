import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { getTenantByDomain } from "@/lib/tenants";
import { getThemeColors } from "@/lib/themes";
import { getUserById } from "@/lib/users";
import Header from "@/components/organisms/Header";
import DashboardContent from "@/components/organisms/DashboardContent";

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
      <DashboardContent
        userEmail={user.email}
        tenantName={user.tenant.name}
        colors={colors}
      />
    </div>
  );
}

