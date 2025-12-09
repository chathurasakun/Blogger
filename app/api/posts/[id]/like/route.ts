import { NextRequest, NextResponse } from "next/server";
import { validateAuthAndTenant } from "@/lib/auth";
import { toggleLikePost } from "@/lib/posts";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate authentication and tenant
    const authResult = await validateAuthAndTenant(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { userId, tenant } = authResult;

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

