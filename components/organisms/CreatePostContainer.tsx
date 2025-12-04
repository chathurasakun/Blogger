"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/molecules/Modal";
import CreatePostForm from "@/components/organisms/CreatePostForm";
import PrimaryActionButton from "@/components/molecules/PrimaryActionButton";
import type { ThemeColors } from "@/lib/themes";
import type { Post } from "@/components/molecules/PostCard";

interface CreatePostContainerProps {
  colors: ThemeColors;
  postToEdit?: Post | null;
  onEditComplete?: () => void;
}

export default function CreatePostContainer({ colors, postToEdit: externalPostToEdit, onEditComplete }: CreatePostContainerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internalPostToEdit, setInternalPostToEdit] = useState<Post | null>(null);

  // Use external postToEdit if provided, otherwise use internal state
  const postToEdit = externalPostToEdit ?? internalPostToEdit;

  // Open modal when external postToEdit is set
  useEffect(() => {
    if (externalPostToEdit) {
      setIsModalOpen(true);
    }
  }, [externalPostToEdit]);

  const handlePostCreated = () => {
    setIsModalOpen(false);
    setInternalPostToEdit(null);
    if (onEditComplete) {
      onEditComplete();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setInternalPostToEdit(null);
    if (onEditComplete) {
      onEditComplete();
    }
  };

  return (
    <>
      <PrimaryActionButton
        type="button"
        colors={colors}
        size="md"
        onClick={() => {
          setInternalPostToEdit(null);
          setIsModalOpen(true);
        }}
      >
        Create New Post
      </PrimaryActionButton>

      {/* Create/Edit Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={postToEdit ? "Edit Post" : "Create a New Post"}
      >
        <CreatePostForm
          colors={colors}
          onSuccess={handlePostCreated}
          onCancel={handleClose}
          postToEdit={postToEdit}
        />
      </Modal>
    </>
  );
}

