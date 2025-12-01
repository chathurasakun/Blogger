import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = url.hostname; // e.g. tenantA.localhost

  const tenantKey = getTenantFromDomain(hostname);

  // Clone headers because req.headers is effectively read‑only
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant", tenantKey);

  // Optional: redirect root → /login (like we already do)
  if (url.pathname === "/") {
    url.pathname = "/login";
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

function getTenantFromDomain(hostname: string) {
  if (hostname === "tenanta.localhost") return "tenantA";
  if (hostname === "tenantb.localhost") return "tenantB";
  return "default";
}
