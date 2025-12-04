import { useState } from "react";

export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      setIsLoading(false);
      return { ok: true };
    } catch (err) {
      const errorMessage = "Failed to sign out. Please try again.";
      setError(errorMessage);
      console.error("Sign out error:", err);
      setIsLoading(false);
      return { ok: false, error: errorMessage };
    }
  };

  return {
    signOut,
    isLoading,
    error,
  };
}

