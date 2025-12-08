import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { getTenantByDomain, isUserAdmin } from "@/lib/tenants";
import { getThemeColors } from "@/lib/themes";
import { getUserById } from "@/lib/users";
import { getPostsByTenant } from "@/lib/posts";
import Header from "@/components/organisms/Header";
import PostsContainer from "@/components/organisms/PostsContainer";
import BlogLogo from "@/components/molecules/BlogLogo";

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
    getPostsByTenant(currentTenant.id, session.userId),
  ]);

  if (!user) {
    redirect("/tenant/login");
  }

  // Check if user is admin
  const userIsAdmin = await isUserAdmin(session.userId, currentTenant.id);

  // Get theme colors for consistent styling
  const themeId = currentTenant?.theme || null;
  const colors = getThemeColors(themeId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header title="Dashboard" colors={colors} showSettingsLink={userIsAdmin} tenant={currentTenant} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-4">
            <BlogLogo
              logo={currentTenant.logo}
              alt={currentTenant.blogName || currentTenant.name || "Blog"}
            />
            <div>
              <h2 className="text-2xl font-semibold">
                {currentTenant.blogName || currentTenant.name}
              </h2>
              <p className="mt-1 text-slate-300">
                You are logged in as <strong>{user.email}</strong>
              </p>
            </div>
          </div>
        </div>

        <PostsContainer colors={colors} posts={posts} currentUserId={user.id} />
      </main>
    </div>
  );
}

