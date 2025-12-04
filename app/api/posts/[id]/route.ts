import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTenantByDomain } from "@/lib/tenants";
import { updatePost, deletePost } from "@/lib/posts";

export async function PATCH(
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
      console.error("Session missing required fields:", { 
        session, 
        hasUserId: !!userId, 
        hasTenantId: !!tenantId 
      });
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

    // Parse request body
    const body = await request.json();
    const { title, content } = body;

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Title and content cannot be empty" },
        { status: 400 }
      );
    }

    // Update the post via reusable helper
    const post = await updatePost({
      id: postId,
      title,
      content,
      userId,
    });

    return NextResponse.json(
      { 
        ok: true, 
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt,
          likeCount: post.likeCount,
          userId: post.userId,
          tenantId: post.tenantId,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update post error:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Handle specific errors
      if (error.message === "Post not found") {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }
      
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "You are not authorized to edit this post" },
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

export async function DELETE(
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
      console.error("Session missing required fields:", { 
        session, 
        hasUserId: !!userId, 
        hasTenantId: !!tenantId 
      });
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

    // Delete the post via reusable helper
    await deletePost(postId, userId);

    return NextResponse.json(
      { ok: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete post error:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Handle specific errors
      if (error.message === "Post not found") {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }
      
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "You are not authorized to delete this post" },
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

