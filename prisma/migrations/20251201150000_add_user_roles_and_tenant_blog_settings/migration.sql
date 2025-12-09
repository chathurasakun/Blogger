-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'member');

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN "blogName" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "logo" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'member';

