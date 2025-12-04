"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TextField from "@/components/atoms/TextField";
import Button from "@/components/atoms/Button";
import PrimaryActionButton from "@/components/molecules/PrimaryActionButton";
import SecondaryActionButton from "@/components/molecules/SecondaryActionButton";
import { useLogin } from "@/hooks/useLogin";
import type { ThemeColors } from "@/lib/themes";

interface LoginFormProps {
  colors: ThemeColors;
}

export default function LoginForm({ colors }: LoginFormProps) {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await login({ email, password });

    if (result?.ok) {
      // Login successful - redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
      <header className="mb-6 space-y-1">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Log in
        </h2>
        <p className="text-sm text-slate-300/80">
          Enter your credentials to access your Blogger dashboard.
        </p>
      </header>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email */}
        <TextField
          label="Email"
          colors={colors}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          placeholder="you@example.com"
        />

        {/* Password */}
        <TextField
          label="Password"
          colors={colors}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          placeholder="••••••••"
          labelAction={
            <Button
              type="button"
              colors={colors}
              variant="text"
            >
              Forgot password?
            </Button>
          }
        />

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
        <PrimaryActionButton
          type="submit"
          colors={colors}
          isLoading={isLoading}
          loadingText="Signing in..."
        >
          Continue to dashboard
        </PrimaryActionButton>

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
            <SecondaryActionButton href="/tenant/signup" colors={colors}>
              Create a free account
            </SecondaryActionButton>
          </div>
        </div>
      </form>
    </div>
  );
}

