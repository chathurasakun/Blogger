import Link from "next/link";
import { headers } from "next/headers";
import { getTenantByDomain } from "@/lib/tenants";

export default async function LoginPage() {
  const host = headers().get("host") ?? "";
  const tenant = host ? await getTenantByDomain(host) : null;

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
            Double-check the URL or create a new account.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-slate-300/40 hover:bg-slate-800/80"
            >
              Go to homepage
            </Link>
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-400/40 hover:brightness-110"
            >
              Create a workspace
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
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Welcome back to {tenant.name}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Sign in to{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              manage your stories
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed max-w-xl">
            Draft, edit, and publish your blog posts with a delightful writing
            experience. Continue where you left off and keep your audience
            engaged.
          </p>

          <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-300/80">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                1
              </span>
              <span>Focus mode editor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                2
              </span>
              <span>Instant previews</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                3
              </span>
              <span>Collaborative drafts</span>
            </div>
          </div>
        </section>

        {/* Right: Auth Card */}
        <section className="relative">
          <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-emerald-400/40 via-cyan-400/20 to-sky-500/40 opacity-60 blur-2xl" />
          <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <header className="mb-6 space-y-1">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Log in
              </h2>
              <p className="text-sm text-slate-300/80">
                Enter your credentials to access your Blogger dashboard.
              </p>
            </header>

            <form className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-200"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400/70 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/60 placeholder:text-slate-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium uppercase tracking-wide text-slate-200"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-emerald-300 hover:text-emerald-200 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400/70 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/60 placeholder:text-slate-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between gap-3 text-xs text-slate-300/90">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-white/20 bg-slate-900/70 text-emerald-400 focus:ring-emerald-500/60"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Primary action */}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-400/40 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Continue to dashboard
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
                or
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
              </div>

              {/* Secondary sign-up action */}
              <div className="space-y-2 text-center text-xs text-slate-300/90">
                <p>New to Blogger?</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/signup"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-300/40 bg-transparent px-4 py-2.5 text-sm font-medium text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    Create a free account
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}