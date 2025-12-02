"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ThemeColors } from "@/lib/themes";

interface LoginFormProps {
  colors: ThemeColors;
}

export default function LoginForm({ colors }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Login successful - redirect to dashboard
      router.push("/dashboard");
      // Optionally refresh to update session state
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={`block w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 transition ${colors.inputFocusBorder} focus:bg-slate-900 focus:ring-2 ${colors.inputFocusRing} placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed`}
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
            className={`text-xs font-medium ${colors.forgotPasswordText} ${colors.forgotPasswordHover} hover:underline`}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={`block w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 transition ${colors.inputFocusBorder} focus:bg-slate-900 focus:ring-2 ${colors.inputFocusRing} placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="••••••••"
          />
        </div>
      </div>

      {/* Remember me */}
      <div className="flex items-center justify-between gap-3 text-xs text-slate-300/90">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className={`h-3.5 w-3.5 rounded border-white/20 bg-slate-900/70 ${colors.checkboxColor} ${colors.checkboxFocusRing}`}
          />
          <span>Keep me signed in</span>
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Primary action */}
      <button
        type="submit"
        disabled={isLoading}
        className={`inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r ${colors.buttonGradient} px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg ${colors.buttonShadow} transition ${colors.buttonHoverShadow} hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 ${colors.buttonFocusRing} focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100`}
      >
        {isLoading ? "Signing in..." : "Continue to dashboard"}
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
            className={`inline-flex w-full items-center justify-center rounded-xl border ${colors.linkBorder} bg-transparent px-4 py-2.5 text-sm font-medium ${colors.linkText} transition ${colors.linkHoverBorder} ${colors.linkHoverBg} focus-visible:outline-none focus-visible:ring-2 ${colors.buttonFocusRing} focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
          >
            Create a free account
          </Link>
        </div>
      </div>
    </form>
  );
}

