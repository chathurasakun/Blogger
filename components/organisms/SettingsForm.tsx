"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TextField from "@/components/atoms/TextField";
import PrimaryActionButton from "@/components/molecules/PrimaryActionButton";
import { useUpdateTenantSettings } from "@/hooks/useUpdateTenantSettings";
import type { ThemeColors } from "@/lib/themes";
import type { Tenant } from "@/lib/tenants";

interface SettingsFormProps {
  tenant: Tenant;
  colors: ThemeColors;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SettingsForm({ tenant, colors, onSuccess, onCancel }: SettingsFormProps) {
  const router = useRouter();
  const { updateSettings, uploadLogo, isLoading, error } = useUpdateTenantSettings();
  const [blogName, setBlogName] = useState(tenant.blogName || "");
  const [logo, setLogo] = useState(tenant.logo || "");
  const [logoPreview, setLogoPreview] = useState<string | null>(tenant.logo || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBlogName(tenant.blogName || "");
    setLogo(tenant.logo || "");
    setLogoPreview(tenant.logo || null);
    setLogoFile(null);
    setLogoRemoved(false);
  }, [tenant]);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP, or SVG)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size too large. Maximum size is 5MB");
      return;
    }

    setLogoFile(file);
    setLogoRemoved(false); // Reset removed flag when new file is selected
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogo("");
    setLogoRemoved(true); // Mark that logo was intentionally removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let logoUrl: string | null = null;

    // If logo was removed, explicitly set to null
    if (logoRemoved) {
      logoUrl = null;
    }
    // Upload file if a new file was selected
    else if (logoFile) {
      setIsUploading(true);
      const uploadedUrl = await uploadLogo(logoFile);
      setIsUploading(false);
      
      if (!uploadedUrl) {
        return; // Error is already set by uploadLogo
      }
      
      logoUrl = uploadedUrl;
    }
    // Otherwise keep existing logo (if any)
    else if (logo && logo.trim()) {
      logoUrl = logo;
    }

    const result = await updateSettings({
      blogName: blogName.trim() || undefined,
      logo: logoRemoved ? null : (logoUrl || undefined),
    });

    if (result?.ok) {
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Blog Name */}
      <TextField
        label="Blog Name"
        colors={colors}
        id="blogName"
        name="blogName"
        type="text"
        value={blogName}
        onChange={(e) => setBlogName(e.target.value)}
        disabled={isLoading}
        placeholder="Enter blog name"
      />
      <p className="text-xs text-slate-400 -mt-3">
        This will be displayed as the name of your blog
      </p>

      {/* Logo Upload */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium uppercase tracking-wide text-slate-200">
          Logo
        </label>
        <div
          className={`relative border-2 border-dashed rounded-xl transition-colors ${
            dragActive
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-white/20 bg-slate-900/60 hover:border-white/30"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="logo"
            name="logo"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleFileInputChange}
            disabled={isLoading || isUploading}
            className="hidden"
          />
          
          {logoPreview ? (
            <div className="p-6 flex flex-col items-center gap-4">
              <div className="relative">
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={128}
                  height={128}
                  className="h-32 w-32 rounded-full object-cover border-2 border-green-500"
                  unoptimized={logoPreview.startsWith("data:")}
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  disabled={isLoading || isUploading}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 hover:bg-red-600 text-white p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove logo"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-300 mb-2">
                  {logoFile ? logoFile.name : "Current logo"}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {logoFile ? "Change image" : "Upload new image"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full border-2 border-green-500 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold h-20 w-20 text-3xl">
                  {(blogName || tenant.name || "B").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-slate-300 mb-2">
                    Drag and drop an image here, or click to browse
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isUploading}
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Choose file
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  PNG, JPG, GIF, WebP or SVG (max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <PrimaryActionButton
          type="submit"
          colors={colors}
          isLoading={isLoading || isUploading}
          loadingText={isUploading ? "Uploading logo..." : "Saving settings..."}
        >
          Save Changes
        </PrimaryActionButton>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-slate-800/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

