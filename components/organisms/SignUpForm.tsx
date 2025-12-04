"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TextField from "@/components/atoms/TextField";
import PrimaryActionButton from "@/components/molecules/PrimaryActionButton";
import SecondaryActionButton from "@/components/molecules/SecondaryActionButton";
import type { ThemeColors } from "@/lib/themes";

interface SignUpFormProps {
  colors: ThemeColors;
}

export default function SignUpForm({ colors }: SignUpFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Sign up failed");
        setIsLoading(false);
        return;
      }

      // Sign up successful - redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
      <header className="mb-6 space-y-1">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Create account
        </h2>
        <p className="text-sm text-slate-300/80">
          Sign up to start managing your blog posts.
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          placeholder="••••••••"
        />

        {/* Confirm Password */}
        <TextField
          label="Confirm Password"
          colors={colors}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          placeholder="••••••••"
        />

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
          loadingText="Creating account..."
        >
          Create account
        </PrimaryActionButton>

        {/* Divider */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
          or
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
        </div>

        {/* Secondary sign-in action */}
        <div className="space-y-2 text-center text-xs text-slate-300/90">
          <p>Already have an account?</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <SecondaryActionButton href="/tenant/login" colors={colors}>
              Sign in
            </SecondaryActionButton>
          </div>
        </div>
      </form>
    </div>
  );
}

