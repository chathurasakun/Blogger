import { NextRequest, NextResponse } from "next/server";
import { validateAuthAndTenant } from "@/lib/auth";
import { createPost } from "@/lib/posts";

export async function POST(request: NextRequest) {
  try {
    // Validate authentication and tenant
    const authResult = await validateAuthAndTenant(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { userId, tenant } = authResult;

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

    // Create the post via reusable helper
    const post = await createPost({
      title,
      content,
      tenantId: tenant.id,
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Create post error:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

