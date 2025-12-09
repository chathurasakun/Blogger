import { useState } from "react";

export function useDeletePost() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePost = async (id: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
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
    deletePost,
    isLoading,
    error,
  };
}

