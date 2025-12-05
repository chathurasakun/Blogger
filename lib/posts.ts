import { prisma } from "@/lib/prisma";

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  tenantId: string;
  userId: string;
  likeCount: number;
  tenant?: {
    id: string;
    name: string;
    domain: string;
    theme: string;
  };
  user?: {
    id: string;
    email: string;
  };
  comments?: Array<{
    id: string;
    content: string;
    createdAt: Date;
    postId: string;
    userId: string;
  }>;
  likes?: Array<{
    id: string;
    postId: string;
    userId: string;
    createdAt: Date;
  }>;
}

interface CreatePostParams {
  title: string;
  content: string;
  tenantId: string;
  userId: string;
}

interface UpdatePostParams {
  id: string;
  title: string;
  content: string;
  userId: string;
}

export async function createPost({ title, content, tenantId, userId }: CreatePostParams) {
  return prisma.post.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      tenantId,
      userId,
      likeCount: 0,
    },
  });
}

export async function updatePost({ id, title, content, userId }: UpdatePostParams) {
  // First verify the post exists and belongs to the user
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.post.update({
    where: { id },
    data: {
      title: title.trim(),
      content: content.trim(),
    },
  });
}

export async function deletePost(id: string, userId: string) {
  // First verify the post exists and belongs to the user
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.post.delete({
    where: { id },
  });
}

export async function getPostsByTenant(tenantId: string, currentUserId?: string) {
  const posts = await prisma.post.findMany({
    where: {
      tenantId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      likes: currentUserId
        ? {
            where: {
              userId: currentUserId,
            },
            select: {
              id: true,
            },
          }
        : false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map posts to include isLiked flag
  return posts.map((post: Post) => {
    const { likes, ...rest } = post;
    return {
      ...rest,
      isLiked: currentUserId ? (likes && Array.isArray(likes) ? likes.length > 0 : false) : false,
    };
  });
}

export async function toggleLikePost(postId: string, userId: string, tenantId: string) {
  // First verify the post exists
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // Verify user is in the same tenant as the post
  if (post.tenantId !== tenantId) {
    throw new Error("Unauthorized");
  }

  // Check if user already liked the post
  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingLike) {
    // Unlike: delete the like and decrement count
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    });

    return { liked: false, likeCount: updatedPost.likeCount };
  } else {
    // Like: create the like and increment count
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    return { liked: true, likeCount: updatedPost.likeCount };
  }
}
