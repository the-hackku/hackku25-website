-- CreateTable
CREATE TABLE "TravelReimbursement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transportationMethod" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "estimatedCost" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelReimbursement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TravelReimbursement_userId_address_key" ON "TravelReimbursement"("userId", "address");

-- AddForeignKey
ALTER TABLE "TravelReimbursement" ADD CONSTRAINT "TravelReimbursement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
