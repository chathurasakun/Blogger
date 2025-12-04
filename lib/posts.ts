import { prisma } from "@/lib/prisma";

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

export async function getPostsByTenant(tenantId: string) {
  return prisma.post.findMany({
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
