"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import { useSignOut } from "@/hooks/useSignOut";
import type { ThemeColors } from "@/lib/themes";

interface SignOutButtonProps {
  colors?: ThemeColors;
}

export default function SignOutButton({ colors }: SignOutButtonProps) {
  const router = useRouter();
  const { signOut, isLoading, error } = useSignOut();

  const handleSignOut = async () => {
    const result = await signOut();

    if (result?.ok) {
      // Sign out successful - redirect to login page
      router.push("/tenant/login");
      router.refresh();
    }
  };

  // If theme colors are provided, use Button component for consistency
  if (colors) {
    return (
      <div className="space-y-1">
        <Button
          type="button"
          colors={colors}
          variant="secondary"
          onClick={handleSignOut}
          disabled={isLoading}
          isLoading={isLoading}
          loadingText="Signing out..."
        >
          Sign out
        </Button>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }

  // Fallback for when no theme is provided (simpler styling)
  return (
    <div className="space-y-1">
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing out..." : "Sign out"}
      </button>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

