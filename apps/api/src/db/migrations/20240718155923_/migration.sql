-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('SUBMITTED', 'INREVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Request" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" TEXT NOT NULL,
    "DonorId" TEXT NOT NULL,
    "DonationAmount" DOUBLE PRECISION NOT NULL,
    "TransactionUrl" TEXT NOT NULL,
    "CauseUrl" TEXT NOT NULL,
    "VolunteerHours" INTEGER NOT NULL,
    "VolunteerEvidence" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);
