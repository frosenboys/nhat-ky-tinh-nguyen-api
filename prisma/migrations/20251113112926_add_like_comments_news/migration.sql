/*
  Warnings:

  - You are about to drop the column `marked` on the `Missions` table. All the data in the column will be lost.
  - The `type` column on the `Notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `authorId` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('GLOBAL', 'USER', 'GROUP');

-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_submissionId_fkey";

-- AlterTable
ALTER TABLE "MissionSubmission" ADD COLUMN     "for" "UserType" NOT NULL DEFAULT 'GLOBAL';

-- AlterTable
ALTER TABLE "Missions" DROP COLUMN "marked",
ADD COLUMN     "for" VARCHAR(10);

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "authorId" TEXT NOT NULL,
ALTER COLUMN "submissionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "type",
ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'GLOBAL';

-- DropEnum
DROP TYPE "NotificationType";

-- CreateTable
CREATE TABLE "NewsLike" (
    "id" SERIAL NOT NULL,
    "newsId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsComment" (
    "id" SERIAL NOT NULL,
    "newsId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsLike_newsId_userId_key" ON "NewsLike"("newsId", "userId");

-- AddForeignKey
ALTER TABLE "MissionSubmission" ADD CONSTRAINT "MissionSubmission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Missions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "MissionSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsLike" ADD CONSTRAINT "NewsLike_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsLike" ADD CONSTRAINT "NewsLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsComment" ADD CONSTRAINT "NewsComment_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsComment" ADD CONSTRAINT "NewsComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;
