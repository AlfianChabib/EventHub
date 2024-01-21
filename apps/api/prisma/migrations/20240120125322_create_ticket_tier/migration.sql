-- CreateTable
CREATE TABLE "TicketTier" (
    "id" SERIAL NOT NULL,
    "nameTier" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "eventId" INTEGER,

    CONSTRAINT "TicketTier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketTier" ADD CONSTRAINT "TicketTier_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
