import { NextRequest, NextResponse } from "next/server";
import { validateAuthAndTenant } from "@/lib/auth";
import { updatePost, deletePost } from "@/lib/posts";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate authentication and tenant
    const authResult = await validateAuthAndTenant(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { userId } = authResult;

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
    // Validate authentication and tenant
    const authResult = await validateAuthAndTenant(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { userId } = authResult;

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

