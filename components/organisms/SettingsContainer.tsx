"use client";

import { useState } from "react";
import Modal from "@/components/molecules/Modal";
import SettingsForm from "@/components/organisms/SettingsForm";
import type { ThemeColors } from "@/lib/themes";
import type { Tenant } from "@/lib/tenants";

interface SettingsContainerProps {
  tenant: Tenant;
  colors: ThemeColors;
}

export default function SettingsContainer({ tenant, colors }: SettingsContainerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSettingsUpdated = () => {
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Settings Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Tenant Settings"
      >
        <SettingsForm
          tenant={tenant}
          colors={colors}
          onSuccess={handleSettingsUpdated}
          onCancel={handleClose}
        />
      </Modal>
    </>
  );
}

