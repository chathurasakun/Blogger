"use client";

import { useState } from "react";
import Modal from "@/components/molecules/Modal";
import CreatePostForm from "@/components/organisms/CreatePostForm";
import PrimaryActionButton from "@/components/molecules/PrimaryActionButton";
import type { ThemeColors } from "@/lib/themes";

interface CreatePostContainerProps {
  colors: ThemeColors;
}

export default function CreatePostContainer({ colors }: CreatePostContainerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostCreated = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <PrimaryActionButton
        type="button"
        colors={colors}
        size="md"
        onClick={() => setIsModalOpen(true)}
      >
        Create New Post
      </PrimaryActionButton>

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

