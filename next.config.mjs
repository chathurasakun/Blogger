/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests from tenant subdomains in development
  // This is needed because we use subdomains like tenanta.localhost, tenantb.localhost
  // to serve different tenants, and Next.js internal resources (_next/*) need to be
  // accessible from these subdomains
  // 
  // NOTE: This only affects development. In production, ensure all tenant subdomains
  // are served from the same origin (via reverse proxy/load balancer) to avoid
  // cross-origin issues with Next.js internal assets.
  allowedDevOrigins: [
    "tenanta.localhost",
    "tenantb.localhost",
  ],
};

export default nextConfig;

