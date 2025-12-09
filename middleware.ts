import { NextResponse, type NextRequest } from "next/server";
import { getTenantByDomain, getAllTenants, Tenant } from "@/lib/tenants";

// Public routes that don't require authentication
const publicRoutes = ["/tenant/login", "/tenant/signup"];

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const hostname = url.hostname; // e.g. tenantA.localhost

  // Extract tenant key from domain by querying the database
  const tenantKey = await getTenantFromDomain(hostname);

  // Clone headers because req.headers is effectively read‑only
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant", tenantKey);

  // Redirect legacy /login and /signup to /tenant/login and /tenant/signup for tenant domains
  if (tenantKey !== "default") {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/tenant/login", req.url));
    }
    if (pathname === "/signup") {
      return NextResponse.redirect(new URL("/tenant/signup", req.url));
    }
  }

  // Allow home page on base domain (localhost or non-tenant domains)
  // Only redirect root → /tenant/login for tenant domains
  if (pathname === "/" && tenantKey !== "default") {
    return NextResponse.redirect(new URL("/tenant/login", req.url));
  }

  // Allow home page to be accessible on base domain
  if (pathname === "/" && tenantKey === "default") {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check for session cookie
  const sessionCookie = req.cookies.get("session");

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL("/tenant/login", req.url);
    // Preserve the original URL as a query parameter for redirect after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing public route (login/signup) with valid session, redirect to dashboard
  if (isPublicRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Continue with the request
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

async function getTenantFromDomain(hostname: string): Promise<string> {
  try {
    // Try exact match first
    let tenant = await getTenantByDomain(hostname);
    
    // If not found, try matching with port variations (e.g., "tenanta.localhost" matches "tenanta.localhost:3004")
    if (!tenant) {
      const tenants = await getAllTenants();
      tenant = tenants.find((t: Tenant) => {
        const domainWithoutPort = t.domain.split(':')[0];
        return domainWithoutPort === hostname;
      }) || null;
    }
    
    // If tenant found, use its name as the key, otherwise default
    return tenant ? tenant.name : "default";
  } catch (error) {
    // If database query fails, fall back to default
    console.error("Error fetching tenant from domain:", error);
    return "default";
  }
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
