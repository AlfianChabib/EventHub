/*
  Warnings:

  - You are about to drop the column `startdate` on the `Event` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "startdate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;
