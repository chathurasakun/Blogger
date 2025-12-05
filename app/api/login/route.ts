import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { getTenantByDomain } from "@/lib/tenants";
import { comparePassword } from "@/lib/password";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "@/lib/rate-limit";
import { getUserByEmail } from "@/lib/users";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Rate limiting: 5 attempts per 5 minutes per IP
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientId, 5, 5 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      return createRateLimitResponse(
        rateLimit,
        5,
        "Too many login attempts. Please try again in 5 mins."
      );
    }

    // Get the current tenant from the domain
    const host = request.headers.get("host") ?? "";
    const tenant = host ? await getTenantByDomain(host) : null;

    if (!tenant) {
      return NextResponse.json(
        { error: "Invalid tenant domain" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare hashed password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // CRITICAL: Verify user belongs to the current tenant
    if (user.tenantId !== tenant.id) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create tenant-scoped session
    await createSession(user.id, user.tenantId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

