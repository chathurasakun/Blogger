import { prisma } from "@/lib/prisma";

interface CreatePostParams {
  title: string;
  content: string;
  tenantId: string;
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
