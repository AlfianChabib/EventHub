/*
  Warnings:

  - Made the column `eventId` on table `EventPromotion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `EventPromotion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EventPromotion" DROP CONSTRAINT "EventPromotion_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventPromotion" DROP CONSTRAINT "EventPromotion_userId_fkey";

-- AlterTable
ALTER TABLE "EventPromotion" ALTER COLUMN "eventId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EventPromotion" ADD CONSTRAINT "EventPromotion_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPromotion" ADD CONSTRAINT "EventPromotion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
