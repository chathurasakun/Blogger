import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateUserRoles() {
  try {
    // Update user1@tenantb.localhost to admin
    const user = await prisma.user.update({
      where: { email: "user1@tenantb.localhost" },
      data: { role: "admin" },
    });
    console.log(`✅ Updated ${user.email} to admin role`);
  } catch (error) {
    console.error("❌ Error updating users:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRoles();

