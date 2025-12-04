import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { getTenantByDomain } from "@/lib/tenants";
import { getThemeColors } from "@/lib/themes";
import { getUserById } from "@/lib/users";
import { getPostsByTenant } from "@/lib/posts";
import Header from "@/components/organisms/Header";
import CreatePostContainer from "@/components/organisms/CreatePostContainer";
import PostsList from "@/components/organisms/PostsList";

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

  // Fetch user and posts in parallel (they don't depend on each other)
  const [user, posts] = await Promise.all([
    getUserById(session.userId),
    getPostsByTenant(currentTenant.id),
  ]);

  if (!user) {
    redirect("/tenant/login");
  }

  // Get theme colors for consistent styling
  const themeId = currentTenant?.theme || null;
  const colors = getThemeColors(themeId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header title="Dashboard" userEmail={user.email} colors={colors} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Welcome back!</h2>
            <p className="mt-1 text-slate-300">
              You are logged in as <strong>{user.email}</strong> from{" "}
              <strong>{user.tenant.name}</strong>.
            </p>
          </div>
          <CreatePostContainer colors={colors} />
        </div>

        <PostsList colors={colors} posts={posts} currentUserId={user.id} />
      </main>
    </div>
  );
}

