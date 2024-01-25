/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.
  - Made the column `eventId` on table `Discount` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_eventId_fkey";

-- AlterTable
ALTER TABLE "Discount" ALTER COLUMN "eventId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Discount_eventId_key" ON "Discount"("eventId");

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
