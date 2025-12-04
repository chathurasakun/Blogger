"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TextField from "@/components/atoms/TextField";
import TextArea from "@/components/atoms/TextArea";
import PrimaryActionButton from "@/components/molecules/PrimaryActionButton";
import { useCreatePost } from "@/hooks/useCreatePost";
import type { ThemeColors } from "@/lib/themes";

interface CreatePostFormProps {
  colors: ThemeColors;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreatePostForm({ colors, onSuccess, onCancel }: CreatePostFormProps) {
  const router = useRouter();
  const { createPost, isLoading, error } = useCreatePost();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await createPost({ title, content });

    if (result?.ok) {
      // Post created successfully - reset form
      setTitle("");
      setContent("");

      // Refresh the server component to fetch new posts
      router.refresh();

      // Call onSuccess callback if provided (to close modal)
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Title */}
      <TextField
        label="Title"
        colors={colors}
        id="title"
        name="title"
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        placeholder="Enter post title"
      />

      {/* Content */}
      <TextArea
        label="Content"
        colors={colors}
        id="content"
        name="content"
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
        placeholder="Write your post content here..."
        rows={8}
      />

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <PrimaryActionButton
          type="submit"
          colors={colors}
          isLoading={isLoading}
          loadingText="Creating post..."
        >
          Create Post
        </PrimaryActionButton>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-slate-800/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

