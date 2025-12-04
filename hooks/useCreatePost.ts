import { useState } from "react";

interface CreatePostParams {
  title: string;
  content: string;
}

export function useCreatePost() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async ({ title, content }: CreatePostParams) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
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
    createPost,
    isLoading,
    error,
  };
}

