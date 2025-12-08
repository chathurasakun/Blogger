import { headers } from "next/headers";
import { getTenantByDomain, getAllTenants } from "@/lib/tenants";
import { getThemeColors } from "@/lib/themes";
import LoginForm from "@/components/organisms/LoginForm";
import DomainSelector from "@/components/molecules/DomainSelector";
import TenantNotFound from "@/components/molecules/TenantNotFound";

export default async function LoginPage() {
  const host = headers().get("host") ?? "";
  const tenant = host ? await getTenantByDomain(host) : null;
  const allTenants = await getAllTenants();
  
  // Get theme from database, fallback to "emerald" if not set
  const themeId = tenant?.theme || null;
  const colors = getThemeColors(themeId);

  // If tenant is not found for this domain, show a friendly message instead of throwing.
  if (!tenant) {
    return <TenantNotFound host={host} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex items-center justify-center px-4 py-10">
      {/* Domain Selector - Top Right */}
      <div className="fixed top-4 right-4 z-30">
        <DomainSelector
          tenants={allTenants}
          currentDomain={host}
          currentPath="/tenant/login"
        />
      </div>

      <div className="w-full max-w-5xl grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
        {/* Left: Marketing / Intro */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
            <span className={`h-1.5 w-1.5 rounded-full ${colors.badgeBg}`} />
            Welcome back to {tenant.name}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Sign in to{" "}
            <span className={`bg-gradient-to-r ${colors.gradientTextFrom} ${colors.gradientTextVia} ${colors.gradientTextTo} bg-clip-text text-transparent`}>
              manage your blog posts
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed max-w-xl">
            Create, edit, and publish your blog posts with a delightful writing
            experience. Continue where you left off and keep your audience
            engaged.
          </p>
        </section>

        {/* Right: Auth Card */}
        <section className="relative">
          <div className={`pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br ${colors.gradientFrom}/40 ${colors.gradientVia}/20 ${colors.gradientTo}/40 opacity-60 blur-2xl`} />
          <LoginForm colors={colors} />
        </section>
      </div>
    </main>
  );
}