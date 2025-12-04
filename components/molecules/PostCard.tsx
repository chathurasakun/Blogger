"use client";

import type { ThemeColors } from "@/lib/themes";

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
}

export default function PostCard({ post, colors, currentUserId }: PostCardProps) {
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
        </div>
      </div>
      <p className="text-slate-300 whitespace-pre-wrap mb-3">{post.content}</p>
      <div className="flex justify-end">
        <p className="text-xs text-slate-500">{formattedDate}</p>
      </div>
    </div>
  );
}

