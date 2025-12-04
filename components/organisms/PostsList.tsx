"use client";

import type { ThemeColors } from "@/lib/themes";
import PostCard, { type Post } from "@/components/molecules/PostCard";

interface PostsListProps {
  colors: ThemeColors;
  posts: Post[];
  currentUserId: string;
}

export default function PostsList({ colors, posts, currentUserId }: PostsListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6">
        <h3 className="mb-2 text-lg font-semibold">Your Posts</h3>
        <p className="text-slate-400">
          No posts yet. Create your first post to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="mb-4 text-lg font-semibold">All Posts</h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} colors={colors} currentUserId={currentUserId} />
      ))}
    </div>
  );
}

export type { Post };

