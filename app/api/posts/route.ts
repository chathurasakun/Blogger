import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTenantByDomain } from "@/lib/tenants";
import { createPost } from "@/lib/posts";

export async function POST(request: NextRequest) {
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

