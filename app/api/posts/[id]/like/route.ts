import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTenantByDomain } from "@/lib/tenants";
import { toggleLikePost } from "@/lib/posts";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract userId and tenantId with proper type handling
    const userId = session.userId;
    const tenantId = session.tenantId;

    // Ensure session has required fields
    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
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

    // Verify session belongs to current tenant
    if (tenantId !== tenant.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get post ID from params
    const postId = params.id;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Toggle like (automatically determines if like or unlike based on existing state)
    const result = await toggleLikePost(postId, userId, tenant.id);

    return NextResponse.json(
      { 
        ok: true, 
        liked: result.liked,
        likeCount: result.likeCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Toggle like error:", error);
    if (error instanceof Error) {
      if (error.message === "Post not found") {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }
      
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "You are not authorized to like this post" },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

