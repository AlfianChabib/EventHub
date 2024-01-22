/*
  Warnings:

  - You are about to drop the column `isPrecent` on the `EventPromotion` table. All the data in the column will be lost.
  - Added the required column `eventTitle` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `TicketTier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventPromotion" DROP COLUMN "isPrecent",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "eventTitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TicketTier" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "ticketId" INTEGER;

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "discountStartDate" TIMESTAMP(3) NOT NULL,
    "discountEndDate" TIMESTAMP(3) NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "eventId" INTEGER,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventPromotion" ADD CONSTRAINT "EventPromotion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTier" ADD CONSTRAINT "TicketTier_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
