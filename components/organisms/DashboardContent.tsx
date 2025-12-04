"use client";

import { useState } from "react";
import Modal from "@/components/molecules/Modal";
import CreatePostForm from "@/components/organisms/CreatePostForm";
import PrimaryActionButton from "@/components/molecules/PrimaryActionButton";
import type { ThemeColors } from "@/lib/themes";

interface DashboardContentProps {
  userEmail: string;
  tenantName: string;
  colors: ThemeColors;
}

export default function DashboardContent({
  userEmail,
  tenantName,
  colors,
}: DashboardContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostCreated = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Welcome back!</h2>
            <p className="mt-1 text-slate-300">
              You are logged in as <strong>{userEmail}</strong> from{" "}
              <strong>{tenantName}</strong>.
            </p>
          </div>
          <PrimaryActionButton
            type="button"
            colors={colors}
            size="md"
            onClick={() => setIsModalOpen(true)}
          >
            Create New Post
          </PrimaryActionButton>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6">
          <h3 className="mb-2 text-lg font-semibold">Your Posts</h3>
          <p className="text-slate-400">
            No posts yet. Create your first post to get started!
          </p>
        </div>
      </main>

      {/* Create Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a New Post"
      >
        <CreatePostForm
          colors={colors}
          onSuccess={handlePostCreated}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}

