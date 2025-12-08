import { useState } from "react";

interface UpdateTenantSettingsParams {
  blogName?: string | null;
  logo?: string | null;
}

export function useUpdateTenantSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("logo", file);

      const response = await fetch("/api/tenant/upload-logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload logo");
      }

      return data.logoUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload logo";
      setError(errorMessage);
      return null;
    }
  };

  const updateSettings = async ({ blogName, logo }: UpdateTenantSettingsParams) => {
    setError(null);
    setIsLoading(true);

    try {
      const body: { blogName?: string | null; logo?: string | null } = {};
      
      if (blogName !== undefined) {
        body.blogName = blogName && blogName.trim() ? blogName.trim() : null;
      }
      
      if (logo !== undefined) {
        body.logo = logo && logo.trim() ? logo.trim() : null;
      }

      const response = await fetch("/api/tenant/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      setIsLoading(false);
      return { ok: true, tenant: data.tenant };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
      return { ok: false, error: errorMessage };
    }
  };

  return {
    updateSettings,
    uploadLogo,
    isLoading,
    error,
  };
}

