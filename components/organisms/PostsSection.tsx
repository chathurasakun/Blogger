"use client";

import { useState, useMemo } from "react";
import type { ThemeColors } from "@/lib/themes";
import SearchBar from "@/components/molecules/SearchBar";
import PostsList, { type Post } from "@/components/organisms/PostsList";

interface PostsSectionProps {
  colors: ThemeColors;
  posts: Post[];
  currentUserId: string;
}

export default function PostsSection({ colors, posts, currentUserId }: PostsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase().trim();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">All Posts</h3>
        <div className="flex-1 max-w-md">
          <SearchBar colors={colors} onSearch={setSearchQuery} />
        </div>
      </div>
      <PostsList
        colors={colors}
        posts={filteredPosts}
        currentUserId={currentUserId}
        isSearching={!!searchQuery.trim()}
      />
    </div>
  );
}

