import { redirect } from "next/navigation";
import { validateDashboardAccess } from "@/lib/auth";
import { getThemeColors } from "@/lib/themes";
import { getPostsByTenant } from "@/lib/posts";
import Header from "@/components/organisms/Header";
import PostsContainer from "@/components/organisms/PostsContainer";
import BlogLogo from "@/components/molecules/BlogLogo";
import AdminBadge from "@/components/molecules/AdminBadge";

export default async function DashboardPage() {
  // Validate all dashboard requirements upfront
  const validationResult = await validateDashboardAccess();

  // If validation fails, redirect to fallback path
  if ("redirect" in validationResult) {
    redirect(validationResult.redirect);
  }

  // Extract validated data
  const { tenant, user, userIsAdmin, session } = validationResult;

  // Fetch posts (user and tenant are already validated)
  const posts = await getPostsByTenant(tenant.id, session.userId);

  // Get theme colors for consistent styling
  const themeId = tenant.theme || null;
  const colors = getThemeColors(themeId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header title="Dashboard" colors={colors} showSettingsLink={userIsAdmin} tenant={tenant} userIsAdmin={userIsAdmin} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <div className={`mb-4 flex items-center gap-4 p-4 rounded-lg ${userIsAdmin ? 'bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5 border border-amber-500/20' : ''}`}>
            <BlogLogo
              logo={tenant.logo}
              alt={tenant.blogName || tenant.name || "Blog"}
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {tenant.blogName || tenant.name}
              </h2>
              <div className="mt-1 flex items-center gap-3 flex-wrap">
                <p className="text-slate-300">
                  You are logged in as <strong className={`${userIsAdmin ? 'text-amber-200' : 'text-slate-100'}`}>{user.email}</strong>
                </p>
                {userIsAdmin && <AdminBadge variant="default" />}
              </div>
            </div>
          </div>
        </div>

        <PostsContainer colors={colors} posts={posts} currentUserId={user.id} />
      </main>
    </div>
  );
}

