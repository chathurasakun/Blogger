import { useState } from "react";

interface SignUpParams {
  email: string;
  password: string;
}

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async ({ email, password }: SignUpParams) => {
    setError(null);
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
        throw new Error(data.error || "Sign up failed");
      }

      setIsLoading(false);
      return { ok: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
      return { ok: false, error: errorMessage };
    }
  };

  return {
    signUp,
    isLoading,
    error,
  };
}

