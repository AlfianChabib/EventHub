/*
  Warnings:

  - You are about to drop the column `event_date` on the `Event` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startdate` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "event_date",
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startdate" TIMESTAMP(3) NOT NULL;
