import Link from "next/link";
import { headers } from "next/headers";
import { getTenantByDomain } from "@/lib/tenants";
import { getThemeColors } from "@/lib/themes";
import SignUpForm from "@/components/organisms/SignUpForm";

export default async function SignUpPage() {
  const host = headers().get("host") ?? "";
  const tenant = host ? await getTenantByDomain(host) : null;
  
  // Get theme from database, fallback to "emerald" if not set
  const themeId = tenant?.theme || null;
  const colors = getThemeColors(themeId);

  // If tenant is not found for this domain, show a friendly message instead of throwing.
  if (!tenant) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-8 text-center text-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
            Tenant not found
          </p>
          <h1 className="mb-3 text-2xl font-semibold">
            This workspace doesn&apos;t exist
          </h1>
          <p className="mb-6 text-sm text-slate-300/80">
            We couldn&apos;t find a Blogger workspace for{" "}
            <span className="font-semibold text-emerald-300">{host}</span>.
            Double-check the URL or contact support.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-slate-300/40 hover:bg-slate-800/80"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
        {/* Left: Marketing / Intro */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
            <span className={`h-1.5 w-1.5 rounded-full ${colors.badgeBg}`} />
            Join {tenant.name}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Create your{" "}
            <span className={`bg-gradient-to-r ${colors.gradientTextFrom} ${colors.gradientTextVia} ${colors.gradientTextTo} bg-clip-text text-transparent`}>
              Blogger account
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed max-w-xl">
            Start writing and publishing your blog posts with a delightful writing
            experience. Join thousands of creators who trust Blogger.
          </p>

          <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-300/80">
            <div className="flex items-center gap-2">
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${colors.badgeBgLight} ${colors.badgeText}`}>
                1
              </span>
              <span>Focus mode editor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${colors.badgeBgLight} ${colors.badgeText}`}>
                2
              </span>
              <span>Instant previews</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${colors.badgeBgLight} ${colors.badgeText}`}>
                3
              </span>
              <span>Collaborative drafts</span>
            </div>
          </div>
        </section>

        {/* Right: Auth Card */}
        <section className="relative">
          <div className={`pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br ${colors.gradientFrom}/40 ${colors.gradientVia}/20 ${colors.gradientTo}/40 opacity-60 blur-2xl`} />
          <SignUpForm colors={colors} />
        </section>
      </div>
    </main>
  );
}

