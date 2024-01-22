/*
  Warnings:

  - You are about to drop the column `discount` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `expireDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isPercent` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isPresale` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `eventDate` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Voucher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Voucher" DROP CONSTRAINT "Voucher_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "discount",
DROP COLUMN "expireDate",
DROP COLUMN "isPercent",
DROP COLUMN "isPresale",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "eventId" INTEGER;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "eventId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';

-- AlterTable
ALTER TABLE "Voucher" ALTER COLUMN "userId" SET NOT NULL;

-- DropTable
DROP TABLE "Rating";

-- DropTable
DROP TABLE "Review";

-- CreateTable
CREATE TABLE "EventPromotion" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "isPrecent" BOOLEAN NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventPromotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventReview" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "reveiw" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EventReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventPromotion_code_key" ON "EventPromotion"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EventPromotion_eventId_key" ON "EventPromotion"("eventId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPromotion" ADD CONSTRAINT "EventPromotion_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventReview" ADD CONSTRAINT "EventReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventReview" ADD CONSTRAINT "EventReview_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
