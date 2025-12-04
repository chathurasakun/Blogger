"use client";

import { Tenant } from "@/lib/tenants";

interface TenantSelectorProps {
  tenants: Tenant[];
}

export default function TenantSelector({ tenants }: TenantSelectorProps) {

  const handleSelectTenant = (domain: string) => {
    // Extract the hostname and port from the domain
    // Domain format: "tenanta.localhost:3004" or "tenantb.localhost:3004"
    const [hostname, port] = domain.split(":");
    const protocol = window.location.protocol;
    const loginUrl = `${protocol}//${hostname}${port ? `:${port}` : ""}/tenant/login`;
    window.location.href = loginUrl;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {tenants.map((tenant) => (
          <button
            key={tenant.id}
            onClick={() => handleSelectTenant(tenant.domain)}
            className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {tenant.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{tenant.domain}</p>
              </div>
              <div className="ml-4">
                <svg
                  className="h-6 w-6 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

