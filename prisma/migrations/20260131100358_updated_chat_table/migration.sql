/*
  Warnings:

  - You are about to drop the column `unreadA` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `unreadB` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `userAId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `userBId` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,peerId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `peerId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userAId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userBId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropIndex
DROP INDEX "Chat_userAId_userBId_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "unreadA",
DROP COLUMN "unreadB",
DROP COLUMN "userAId",
DROP COLUMN "userBId",
ADD COLUMN     "peerId" INTEGER NOT NULL,
ADD COLUMN     "unreadCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Chat_userId_lastMessageAt_idx" ON "Chat"("userId", "lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_userId_peerId_key" ON "Chat"("userId", "peerId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
