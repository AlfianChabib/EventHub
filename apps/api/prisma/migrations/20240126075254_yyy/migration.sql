-- DropForeignKey
ALTER TABLE "EventPromotion" DROP CONSTRAINT "EventPromotion_eventId_fkey";

-- DropIndex
DROP INDEX "EventPromotion_eventId_key";

-- AlterTable
ALTER TABLE "EventPromotion" ALTER COLUMN "eventId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EventPromotion" ADD CONSTRAINT "EventPromotion_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
