/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `EventPromotion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EventPromotion" DROP CONSTRAINT "EventPromotion_userId_fkey";

-- AlterTable
ALTER TABLE "EventPromotion" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventPromotion_eventId_key" ON "EventPromotion"("eventId");

-- AddForeignKey
ALTER TABLE "EventPromotion" ADD CONSTRAINT "EventPromotion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
