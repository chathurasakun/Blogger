"use client";

import { useState } from "react";
import type { ThemeColors } from "@/lib/themes";
import Popover from "@/components/molecules/Popover";
import { useDeletePost } from "@/hooks/useDeletePost";

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  likeCount: number;
  userId: string;
  tenantId: string;
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
  const { deletePost, isLoading } = useDeletePost();
  
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
          <span className="text-sm text-slate-400">❤️ {post.likeCount}</span>
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
      <div className="flex justify-end">
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

