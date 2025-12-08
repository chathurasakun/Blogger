/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests from tenant subdomains in development
  // This is needed because we use subdomains like tenanta.localhost, tenantb.localhost
  // to serve different tenants, and Next.js internal resources (_next/*) need to be
  // accessible from these subdomains
  allowedDevOrigins: [
    "tenanta.localhost",
    "tenantb.localhost",
  ],
};

export default nextConfig;

