import { useState } from "react";
import { useRouter } from "next/navigation";

export function useSignOut() {
  const router = useRouter();
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

      // Redirect to login page
      router.push("/tenant/login");
      router.refresh();
    } catch (err) {
      setError("Failed to sign out. Please try again.");
      console.error("Sign out error:", err);
      setIsLoading(false);
    }
  };

  return {
    signOut,
    isLoading,
    error,
  };
}

