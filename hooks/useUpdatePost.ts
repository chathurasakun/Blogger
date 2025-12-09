import { useState } from "react";

interface UpdatePostParams {
  id: string;
  title: string;
  content: string;
}

export function useUpdatePost() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePost = async ({ id, title, content }: UpdatePostParams) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update post");
      }

      setIsLoading(false);
      return { ok: true, post: data.post };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
      return { ok: false, error: errorMessage };
    }
  };

  return {
    updatePost,
    isLoading,
    error,
  };
}

