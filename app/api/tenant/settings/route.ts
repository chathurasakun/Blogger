import { NextRequest, NextResponse } from "next/server";
import { validateAuthAndAdmin } from "@/lib/auth";
import { updateTenant, getTenantById } from "@/lib/tenants";

export async function GET(request: NextRequest) {
  try {
    // Validate authentication and tenant
    const authResult = await validateAuthAndAdmin(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { tenant } = authResult;

    // Return current tenant settings
    const tenantData = await getTenantById(tenant.id);
    if (!tenantData) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      tenant: tenantData,
    });
  } catch (error) {
    console.error("Get tenant settings error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Validate authentication, tenant, and admin role
    const authResult = await validateAuthAndAdmin(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { tenant } = authResult;

    // Parse request body
    const body = await request.json();
    const { blogName, logo } = body;

    // Validate that at least one field is provided (logo can be null to remove it)
    if (blogName === undefined && logo === undefined) {
      return NextResponse.json(
        { error: "At least one field (blogName or logo) must be provided" },
        { status: 400 }
      );
    }

    // Validate blogName if provided
    if (blogName !== undefined && typeof blogName !== "string") {
      return NextResponse.json(
        { error: "blogName must be a string" },
        { status: 400 }
      );
    }

    // Validate logo if provided (can be string or null)
    if (logo !== undefined && logo !== null && typeof logo !== "string") {
      return NextResponse.json(
        { error: "logo must be a string or null" },
        { status: 400 }
      );
    }

    // Update tenant settings
    const updatedTenant = await updateTenant({
      tenantId: tenant.id,
      blogName: blogName !== undefined ? blogName : undefined,
      logo: logo !== undefined ? logo : undefined,
    });

    return NextResponse.json({
      ok: true,
      tenant: updatedTenant,
    });
  } catch (error) {
    console.error("Update tenant settings error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

