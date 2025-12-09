"use client";

import { useState, useEffect } from "react";
import type { ThemeColors } from "@/lib/themes";
import Popover from "@/components/molecules/Popover";
import { useDeletePost } from "@/hooks/useDeletePost";
import { useLikePost } from "@/hooks/useLikePost";

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  likeCount: number;
  userId: string;
  tenantId: string;
  isLiked?: boolean;
  user: {
    id: string;
    email: string;
  };
}

interface PostCardProps {
  post: Post;
  colors: ThemeColors;
  currentUserId: string;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, colors, currentUserId, onEdit, onDelete }: PostCardProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const { deletePost, isLoading } = useDeletePost();
  const { toggleLike, isLoading: isLikeLoading } = useLikePost();
  
  const createdAt = typeof post.createdAt === "string" 
    ? new Date(post.createdAt) 
    : post.createdAt;
  
  const formattedDate = createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isOwnPost = post.userId === currentUserId;

  // Sync likeCount and isLiked with post prop when it changes
  useEffect(() => {
    setLikeCount(post.likeCount);
    setIsLiked(post.isLiked || false);
  }, [post.likeCount, post.isLiked]);

  const handleLikeClick = async () => {
    if (isLikeLoading) return;

    const result = await toggleLike(post.id);
    
    if (result.ok) {
      setIsLiked(result.liked);
      setLikeCount(result.likeCount);
    }
  };

  const handleEdit = () => {
    setIsPopoverOpen(false);
    if (onEdit) {
      onEdit(post);
    }
  };

  const handleDeleteClick = () => {
    setIsPopoverOpen(false);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    const result = await deletePost(post.id);
    if (result.ok) {
      setShowDeleteConfirm(false);
      if (onDelete) {
        onDelete(post.id);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`rounded-xl border p-6 transition ${
      isOwnPost 
        ? "border-blue-500/30 bg-blue-950/20 hover:border-blue-500/50" 
        : "border-white/10 bg-slate-700/50 hover:border-white/20"
    }`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xl font-semibold text-slate-100">{post.title}</h4>
            {isOwnPost && (
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
                Your post
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-400">
            by <span className="font-medium">{post.user.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOwnPost && (
            <Popover
              isOpen={isPopoverOpen}
              onClose={() => setIsPopoverOpen(false)}
              trigger={
                <button
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700/50 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  aria-label="Post options"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              }
            >
              <div className="py-1">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-700/50"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 transition hover:bg-slate-700/50"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </Popover>
          )}
        </div>
      </div>
      <p className="text-slate-300 whitespace-pre-wrap mb-3">{post.content}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={handleLikeClick}
          disabled={isLikeLoading}
          className="flex items-center gap-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-700/50 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50"
          aria-label={isLiked ? "Unlike post" : "Like post"}
        >
          {isLiked ? (
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
          <span className="text-sm font-medium">{likeCount}</span>
        </button>
        <p className="text-xs text-slate-500">{formattedDate}</p>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl border border-white/10 bg-slate-800 p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-slate-100">Delete Post</h3>
            <p className="mb-6 text-slate-300">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isLoading}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700/50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

