"use client";

import { useState } from "react";
import { Tenant } from "@/lib/tenants";

interface DomainSelectorProps {
  tenants: Tenant[];
  currentDomain: string;
  currentPath: "/tenant/login" | "/tenant/signup";
}

export default function DomainSelector({
  tenants,
  currentDomain,
  currentPath,
}: DomainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentTenant = tenants.find((t) => t.domain === currentDomain);

  const handleSelectTenant = (domain: string) => {
    // Extract the hostname and port from the domain
    const [hostname, port] = domain.split(":");
    const protocol = window.location.protocol;
    const newUrl = `${protocol}//${hostname}${port ? `:${port}` : ""}${currentPath}`;
    window.location.href = newUrl;
  };

  // Filter out current tenant from the list
  const otherTenants = tenants.filter((t) => t.domain !== currentDomain);

  if (otherTenants.length === 0) {
    return null; // Don't show selector if there's only one tenant
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        aria-label="Select domain"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="max-w-[120px] truncate">
          {currentTenant?.name || currentDomain}
        </span>
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl">
            <div className="p-2">
              <div className="mb-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Switch workspace
              </div>
              {otherTenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => handleSelectTenant(tenant.domain)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10 focus:outline-none focus:bg-white/10"
                >
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-xs text-slate-400">{tenant.domain}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

