import { NextResponse, type NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/signup"];

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/posts", "/settings"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const hostname = url.hostname; // e.g. tenantA.localhost

  // Extract tenant key from domain (for reference, not used for DB queries in middleware)
  const tenantKey = getTenantFromDomain(hostname);

  // Clone headers because req.headers is effectively read‑only
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant", tenantKey);

  // Redirect root → /login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
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
    const loginUrl = new URL("/login", req.url);
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

function getTenantFromDomain(hostname: string) {
  if (hostname === "tenanta.localhost") return "tenantA";
  if (hostname === "tenantb.localhost") return "tenantB";
  return "default";
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
