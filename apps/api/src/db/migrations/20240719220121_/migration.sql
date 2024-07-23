/*
  Warnings:

  - You are about to drop the column `CauseUrl` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `DonationAmount` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `DonorId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `TransactionUrl` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `VolunteerEvidence` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `VolunteerHours` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Request` table. All the data in the column will be lost.
  - Added the required column `description` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donationAmount` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donorProfileID` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evidenceURL` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationName` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectURL` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionURL` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volunteerHours` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "CauseUrl",
DROP COLUMN "Description",
DROP COLUMN "DonationAmount",
DROP COLUMN "DonorId",
DROP COLUMN "TransactionUrl",
DROP COLUMN "VolunteerEvidence",
DROP COLUMN "VolunteerHours",
DROP COLUMN "organizationId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "donationAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "donorProfileID" TEXT NOT NULL,
ADD COLUMN     "evidenceURL" TEXT NOT NULL,
ADD COLUMN     "organizationName" TEXT NOT NULL,
ADD COLUMN     "projectURL" TEXT NOT NULL,
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'SUBMITTED',
ADD COLUMN     "transactionURL" TEXT NOT NULL,
ADD COLUMN     "volunteerHours" INTEGER NOT NULL;
