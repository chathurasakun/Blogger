"use client";

import { useState } from "react";
import type { ThemeColors } from "@/lib/themes";
import type { Post } from "@/components/molecules/PostCard";
import CreatePostContainer from "@/components/organisms/CreatePostContainer";
import PostsSection from "@/components/organisms/PostsSection";

interface PostsContainerProps {
  colors: ThemeColors;
  posts: Post[];
  currentUserId: string;
}

export default function PostsContainer({ colors, posts, currentUserId }: PostsContainerProps) {
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  const handleEditPost = (post: Post) => {
    setPostToEdit(post);
  };

  const handleEditComplete = () => {
    setPostToEdit(null);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-end">
        <CreatePostContainer 
          colors={colors} 
          postToEdit={postToEdit} 
          onEditComplete={handleEditComplete} 
        />
      </div>
      <PostsSection 
        colors={colors} 
        posts={posts} 
        currentUserId={currentUserId}
        onEditPost={handleEditPost}
      />
    </>
  );
}

