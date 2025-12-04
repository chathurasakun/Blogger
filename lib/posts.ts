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
