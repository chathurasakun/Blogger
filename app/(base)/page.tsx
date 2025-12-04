import { getAllTenants, Tenant } from "@/lib/tenants";
import TenantSelector from "@/components/molecules/TenantSelector";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

export default async function Home() {
  let tenants: Tenant[] = [];
  
  try {
    tenants = await getAllTenants();
  } catch (error) {
    // Handle case when database is not available (e.g., during build)
    console.error('Failed to fetch tenants:', error);
    // tenants will remain empty array, which will show the fallback message
  }

  // Filter to show only tenant A and B
  // Check both name and domain for flexibility
  const displayTenants = tenants.filter(
    (tenant: Tenant) =>
      tenant.name.toLowerCase().includes("tenanta") ||
      tenant.name.toLowerCase().includes("tenantb") ||
      tenant.domain.toLowerCase().includes("tenanta") ||
      tenant.domain.toLowerCase().includes("tenantb")
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Blogger
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Select a tenant to continue
          </p>
          <p className="text-sm text-gray-500">
            Choose your workspace to sign in
          </p>
        </div>
        {displayTenants.length > 0 ? (
          <TenantSelector tenants={displayTenants} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No tenants available. Please contact your administrator.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

